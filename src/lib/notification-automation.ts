/**
 * PropertyPro - Notification Automation System
 * Handles automated notification triggers and scheduling
 */

import {
  notificationService,
  NotificationType,
  NotificationPriority,
} from "./notification-service";
import {
  IUser,
  IProperty,
  ILease,
  IPayment,
  IMaintenanceRequest,
} from "@/types";
import User from "@/models/User";
import Property from "@/models/Property";
import Lease from "@/models/Lease";
import Payment from "@/models/Payment";
import { PaymentStatus } from "@/types";
import MaintenanceRequest from "@/models/MaintenanceRequest";

// Automation rule interface
export interface AutomationRule {
  id: string;
  name: string;
  type: NotificationType;
  trigger: "schedule" | "event" | "condition";
  conditions: Record<string, any>;
  schedule?: {
    frequency: "daily" | "weekly" | "monthly";
    time: string; // HH:MM format
    dayOfWeek?: number; // 0-6 for weekly
    dayOfMonth?: number; // 1-31 for monthly
  };
  enabled: boolean;
  lastRun?: Date;
  nextRun?: Date;
}

export class NotificationAutomation {
  private automationRules: Map<string, AutomationRule> = new Map();
  private isRunning = false;

  constructor() {
    this.initializeDefaultRules();
    this.startAutomationEngine();
  }

  // Initialize default automation rules
  private initializeDefaultRules(): void {
    // Payment reminder rules
    this.addRule({
      id: "payment_reminder_3_days",
      name: "Payment Reminder - 3 Days Before Due",
      type: NotificationType.PAYMENT_REMINDER,
      trigger: "schedule",
      conditions: { daysBefore: 3 },
      schedule: {
        frequency: "daily",
        time: "09:00",
      },
      enabled: true,
    });

    this.addRule({
      id: "payment_reminder_1_day",
      name: "Payment Reminder - 1 Day Before Due",
      type: NotificationType.PAYMENT_REMINDER,
      trigger: "schedule",
      conditions: { daysBefore: 1 },
      schedule: {
        frequency: "daily",
        time: "09:00",
      },
      enabled: true,
    });

    this.addRule({
      id: "payment_overdue_daily",
      name: "Daily Overdue Payment Reminders",
      type: NotificationType.PAYMENT_OVERDUE,
      trigger: "schedule",
      conditions: { overdue: true },
      schedule: {
        frequency: "daily",
        time: "10:00",
      },
      enabled: true,
    });

    // Lease expiry rules
    this.addRule({
      id: "lease_expiry_60_days",
      name: "Lease Expiry - 60 Days Notice",
      type: NotificationType.LEASE_EXPIRY,
      trigger: "schedule",
      conditions: { daysBefore: 60 },
      schedule: {
        frequency: "daily",
        time: "08:00",
      },
      enabled: true,
    });

    this.addRule({
      id: "lease_expiry_30_days",
      name: "Lease Expiry - 30 Days Notice",
      type: NotificationType.LEASE_EXPIRY,
      trigger: "schedule",
      conditions: { daysBefore: 30 },
      schedule: {
        frequency: "daily",
        time: "08:00",
      },
      enabled: true,
    });

    this.addRule({
      id: "lease_expiry_7_days",
      name: "Lease Expiry - 7 Days Notice",
      type: NotificationType.LEASE_EXPIRY,
      trigger: "schedule",
      conditions: { daysBefore: 7 },
      schedule: {
        frequency: "daily",
        time: "08:00",
      },
      enabled: true,
    });
  }

  // Add automation rule
  addRule(rule: Omit<AutomationRule, "nextRun">): void {
    const fullRule: AutomationRule = {
      ...rule,
      nextRun: this.calculateNextRun(rule.schedule),
    };
    this.automationRules.set(rule.id, fullRule);
  }

  // Remove automation rule
  removeRule(ruleId: string): boolean {
    return this.automationRules.delete(ruleId);
  }

  // Enable/disable rule
  toggleRule(ruleId: string, enabled: boolean): boolean {
    const rule = this.automationRules.get(ruleId);
    if (rule) {
      rule.enabled = enabled;
      if (enabled) {
        rule.nextRun = this.calculateNextRun(rule.schedule);
      }
      return true;
    }
    return false;
  }

  // Calculate next run time for scheduled rules
  private calculateNextRun(
    schedule?: AutomationRule["schedule"]
  ): Date | undefined {
    if (!schedule) return undefined;

    const now = new Date();
    const [hours, minutes] = schedule.time.split(":").map(Number);

    let nextRun = new Date();
    nextRun.setHours(hours, minutes, 0, 0);

    // If the time has passed today, move to next occurrence
    if (nextRun <= now) {
      switch (schedule.frequency) {
        case "daily":
          nextRun.setDate(nextRun.getDate() + 1);
          break;
        case "weekly":
          const daysUntilNext =
            (7 + (schedule.dayOfWeek || 0) - nextRun.getDay()) % 7;
          nextRun.setDate(nextRun.getDate() + (daysUntilNext || 7));
          break;
        case "monthly":
          nextRun.setMonth(nextRun.getMonth() + 1);
          if (schedule.dayOfMonth) {
            nextRun.setDate(schedule.dayOfMonth);
          }
          break;
      }
    }

    return nextRun;
  }

  // Start automation engine
  private startAutomationEngine(): void {
    if (this.isRunning) return;

    this.isRunning = true;

    // Check for scheduled rules every minute
    setInterval(async () => {
      await this.processScheduledRules();
    }, 60000);


  }

  // Process scheduled automation rules
  private async processScheduledRules(): Promise<void> {
    const now = new Date();

    for (const [ruleId, rule] of this.automationRules) {
      if (!rule.enabled || !rule.nextRun || rule.nextRun > now) {
        continue;
      }

      try {
        await this.executeRule(rule);
        rule.lastRun = now;
        rule.nextRun = this.calculateNextRun(rule.schedule);
      } catch (error) {
        console.error(`Failed to execute automation rule ${ruleId}:`, error);
      }
    }
  }

  // Execute automation rule
  private async executeRule(rule: AutomationRule): Promise<void> {
    switch (rule.type) {
      case NotificationType.PAYMENT_REMINDER:
        await this.processPaymentReminders(rule);
        break;
      case NotificationType.PAYMENT_OVERDUE:
        await this.processOverduePayments(rule);
        break;
      case NotificationType.LEASE_EXPIRY:
        await this.processLeaseExpiries(rule);
        break;
      default:
        console.warn(`Unknown automation rule type: ${rule.type}`);
    }
  }

  // Process payment reminders
  private async processPaymentReminders(rule: AutomationRule): Promise<void> {
    const daysBefore = rule.conditions.daysBefore || 0;
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + daysBefore);

    // Find leases with payments due on target date
    const leases = await Lease.find({
      status: "active",
      deletedAt: { $exists: false },
    }).populate("tenantId propertyId");

    for (const lease of leases) {
      // Calculate next payment due date (simplified logic)
      const nextDueDate = new Date(lease.startDate);
      nextDueDate.setMonth(nextDueDate.getMonth() + 1);

      if (this.isSameDay(nextDueDate, targetDate)) {
        const tenant = lease.tenantId as any;
        const property = lease.propertyId as any;

        await notificationService.sendNotification({
          type: NotificationType.PAYMENT_REMINDER,
          priority: NotificationPriority.NORMAL,
          userId: tenant._id.toString(),
          title: "Rent Payment Reminder",
          message: `Your rent payment is due in ${daysBefore} day${
            daysBefore !== 1 ? "s" : ""
          }`,
          data: {
            userEmail: tenant.email,
            userName: `${tenant.firstName} ${tenant.lastName}`,
            propertyName: property.name,
            rentAmount: lease.rentAmount,
            dueDate: nextDueDate.toISOString(),
            daysOverdue: 0,
          },
        });
      }
    }
  }

  // Process overdue payments
  private async processOverduePayments(rule: AutomationRule): Promise<void> {
    const today = new Date();

    // Find overdue payments across enhanced statuses
    const overduePayments = await Payment.find({
      status: {
        $in: [
          PaymentStatus.PENDING,
          PaymentStatus.DUE_SOON,
          PaymentStatus.DUE_TODAY,
          PaymentStatus.GRACE_PERIOD,
          PaymentStatus.OVERDUE,
          PaymentStatus.LATE,
          PaymentStatus.SEVERELY_OVERDUE,
        ],
      },
      dueDate: { $lt: today },
      deletedAt: { $exists: false },
    }).populate("tenantId propertyId");

    for (const payment of overduePayments) {
      const daysOverdue = Math.floor(
        (today.getTime() - payment.dueDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      const tenant = payment.tenantId as any;
      const property = payment.propertyId as any;

      await notificationService.sendNotification({
        type: NotificationType.PAYMENT_OVERDUE,
        priority:
          daysOverdue > 7
            ? NotificationPriority.HIGH
            : NotificationPriority.NORMAL,
        userId: tenant._id.toString(),
        title: "Overdue Payment Notice",
        message: `Your rent payment is ${daysOverdue} day${
          daysOverdue !== 1 ? "s" : ""
        } overdue`,
        data: {
          userEmail: tenant.email,
          userName: `${tenant.firstName} ${tenant.lastName}`,
          propertyName: property.name,
          rentAmount: payment.amount,
          dueDate: payment.dueDate.toISOString(),
          daysOverdue,
        },
      });
    }
  }

  // Process lease expiries
  private async processLeaseExpiries(rule: AutomationRule): Promise<void> {
    const daysBefore = rule.conditions.daysBefore || 0;
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + daysBefore);

    // Find leases expiring on target date
    const expiringLeases = await Lease.find({
      status: "active",
      endDate: {
        $gte: new Date(
          targetDate.getFullYear(),
          targetDate.getMonth(),
          targetDate.getDate()
        ),
        $lt: new Date(
          targetDate.getFullYear(),
          targetDate.getMonth(),
          targetDate.getDate() + 1
        ),
      },
      deletedAt: { $exists: false },
    }).populate("tenantId propertyId");

    for (const lease of expiringLeases) {
      const tenant = lease.tenantId as any;
      const property = lease.propertyId as any;

      await notificationService.sendNotification({
        type: NotificationType.LEASE_EXPIRY,
        priority:
          daysBefore <= 30
            ? NotificationPriority.HIGH
            : NotificationPriority.NORMAL,
        userId: tenant._id.toString(),
        title: "Lease Expiry Notice",
        message: `Your lease expires in ${daysBefore} day${
          daysBefore !== 1 ? "s" : ""
        }`,
        data: {
          userEmail: tenant.email,
          userName: `${tenant.firstName} ${tenant.lastName}`,
          propertyName: property.name,
          expiryDate: lease.endDate.toISOString(),
          daysUntilExpiry: daysBefore,
        },
      });
    }
  }

  // Utility function to check if two dates are the same day
  private isSameDay(date1: Date, date2: Date): boolean {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }

  // Get all automation rules
  getAllRules(): AutomationRule[] {
    return Array.from(this.automationRules.values());
  }

  // Get rule by ID
  getRule(ruleId: string): AutomationRule | undefined {
    return this.automationRules.get(ruleId);
  }
}

// Create singleton instance
export const notificationAutomation = new NotificationAutomation();
