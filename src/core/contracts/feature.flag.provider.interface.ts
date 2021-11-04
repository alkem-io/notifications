export interface IFeatureFlagProvider {
  areNotificationsEnabled(): Promise<boolean>;
}
