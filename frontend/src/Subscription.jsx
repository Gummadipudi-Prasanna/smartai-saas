
import { useEffect, useState, useCallback } from "react";
import api from "./api";

import {
  CheckCircle2,
  Crown,
  Zap,
  CalendarDays,
  Sparkles,
  ShieldCheck,
} from "lucide-react";

import "./Subscription.css";

function Subscription() {
  const [subscription, setSubscription] = useState(null);
  const [usage, setUsage] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [upgrading, setUpgrading] = useState(false);

  // Load Subscription Details
  const loadSubscription = useCallback(async () => {
    try {
      const token = localStorage.getItem("access");

      if (!token) {
        setError("Please login to view subscription details.");
        return;
      }

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const [subscriptionRes, usageRes] = await Promise.all([
        api.get(
          "/api/subscriptions/my-subscription/",
          { headers }
        ),

        api.get(
          "/api/subscriptions/usage/",
          { headers }
        ),
      ]);

      setSubscription(subscriptionRes.data);
      setUsage(usageRes.data);
      setError("");
    } catch (err) {
      console.error(
        "Subscription Error:",
        err.response?.data || err.message
      );

      setError("Unable to load subscription details.");
    }
  }, []);

  useEffect(() => {
    loadSubscription();
  }, [loadSubscription]);

  // Upgrade Subscription
  const handleUpgrade = async () => {
    try {
      setUpgrading(true);
      setError("");
      setSuccess("");

      const token = localStorage.getItem("access");

      if (!token) {
        setError("Please login again.");
        return;
      }

      const response = await api.post(
        "/api/subscriptions/upgrade/",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess(
        response.data.message ||
        "Premium activated successfully!"
      );

      await loadSubscription();
    } catch (err) {
      console.error(
        "Upgrade Error:",
        err.response?.data || err.message
      );

      setError(
        err.response?.data?.detail ||
        "Unable to upgrade. Please try again."
      );
    } finally {
      setUpgrading(false);
    }
  };

  if (error && !subscription) {
    return (
      <div className="subscription-error">
        {error}
      </div>
    );
  }

  if (!subscription || !usage) {
    return (
      <div className="subscription-loading">
        Loading Subscription...
      </div>
    );
  }

  const isPremium = subscription.plan === "premium";

  const usedGenerations = usage.generation_count ?? 0;
  const remaining = usage.remaining ?? 0;
  const dailyLimit = usage.daily_limit ?? 5;

  const usagePercentage =
    dailyLimit > 0
      ? Math.min((usedGenerations / dailyLimit) * 100, 100)
      : 0;

  return (
    <div className="subscription-page">

      {/* Page Header */}
      <div className="subscription-header">
        <div className="subscription-title-icon">
          <Crown size={25} />
        </div>

        <div>
          <h1>My Subscription</h1>
          <p>
            Manage your plan and track your daily usage.
          </p>
        </div>
      </div>

      {/* Notifications */}
      {success && (
        <div className="subscription-success">
          <CheckCircle2 size={18} />
          {success}
        </div>
      )}

      {error && (
        <div className="subscription-error">
          {error}
        </div>
      )}

      {/* Current Plan */}
      <div className="current-plan-card">

        <div className="current-plan-top">
          <div className="plan-icon">
            {isPremium ? (
              <Crown size={28} />
            ) : (
              <Zap size={28} />
            )}
          </div>

          <div className="current-plan-title">
            <span className="plan-label">
              CURRENT PLAN
            </span>

            <h2>
              {subscription.plan.toUpperCase()} PLAN
            </h2>

            <span className="subscription-status">
              {subscription.status}
            </span>
          </div>
        </div>

        {/* Subscription Statistics */}
        <div className="subscription-info">

          <div className="subscription-info-item">
            <span>Daily Limit</span>
            <strong>{dailyLimit} generations</strong>
          </div>

          <div className="subscription-info-item">
            <span>Used Today</span>
            <strong>{usedGenerations}</strong>
          </div>

          <div className="subscription-info-item">
            <span>Remaining</span>
            <strong>{remaining}</strong>
          </div>

          <div className="subscription-info-item">
            <span>Started On</span>
            <strong>
              {new Date(
                subscription.start_date
              ).toLocaleDateString()}
            </strong>
          </div>

        </div>

        {/* Daily Usage */}
        <div className="usage-section">
          <div className="usage-heading">
            <span>Daily Usage</span>

            <strong>
              {usedGenerations} / {dailyLimit}
            </strong>
          </div>

          <div className="usage-track">
            <div
              className="usage-progress"
              style={{
                width: `${usagePercentage}%`,
              }}
            />
          </div>

          <p className="usage-caption">
            {remaining} generations remaining today
          </p>
        </div>

      </div>

      {/* Available Plans */}
      <div className="available-plans-heading">
        <h2>Choose Your Plan</h2>

        <p>
          Select the plan that matches your content needs.
        </p>
      </div>

      <div className="plans-grid">

        {/* Free Plan */}
        <div
          className={`pricing-card ${
            !isPremium ? "selected-plan" : ""
          }`}
        >
          <div className="pricing-card-top">

            <div className="pricing-icon free-icon">
              <Zap size={24} />
            </div>

            {!isPremium && (
              <span className="current-plan-badge">
                Current Plan
              </span>
            )}

          </div>

          <h3>Free Plan</h3>

          <div className="plan-price">
            ₹0 <span>/ forever</span>
          </div>

          <p className="plan-description">
            Get started with SmartAI content generation.
          </p>

          <div className="plan-features">
            <p>
              <CheckCircle2 size={18} />
              5 generations per day
            </p>

            <p>
              <CheckCircle2 size={18} />
              Basic content generation
            </p>

            <p>
              <CheckCircle2 size={18} />
              Content history
            </p>
          </div>

          <div className="plan-action free-plan-action">
            {isPremium
              ? "Free Plan"
              : "Your Current Plan"}
          </div>

        </div>

        {/* Premium Plan */}
        <div
          className={`pricing-card premium-card ${
            isPremium ? "selected-plan" : ""
          }`}
        >
          <div className="pricing-card-top">

            <div className="pricing-icon premium-icon">
              <Crown size={24} />
            </div>

            {isPremium && (
              <span className="current-plan-badge">
                Current Plan
              </span>
            )}

          </div>

          <h3>Premium Plan</h3>

          <div className="plan-price">
            Premium
          </div>

          <p className="plan-description">
            Generate more content with an increased daily limit.
          </p>

          <div className="plan-features">

            <p>
              <CheckCircle2 size={18} />
              50 generations per day
            </p>

            <p>
              <CheckCircle2 size={18} />
              Advanced content generation
            </p>

            <p>
              <CheckCircle2 size={18} />
              Content history
            </p>

            <p>
              <Sparkles size={18} />
              More daily usage
            </p>

          </div>

          {isPremium ? (
            <div className="plan-action premium-plan-action">
              Your Current Plan
            </div>
          ) : (
            <button
              type="button"
              className="plan-action premium-plan-action"
              onClick={handleUpgrade}
              disabled={upgrading}
            >
              {upgrading
                ? "Activating..."
                : "Upgrade to Premium"}
            </button>
          )}

        </div>

      </div>

      {/* Subscription Note */}
      <div className="subscription-note">
        <ShieldCheck size={19} />

        <span>
          Subscription details are updated from your SmartAI account.
        </span>
      </div>

      <div className="subscription-footer">
        <CalendarDays size={17} />
        <span>
          Daily usage resets according to your account date.
        </span>
      </div>

    </div>
  );
}

export default Subscription;
