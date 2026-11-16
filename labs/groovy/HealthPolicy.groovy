/** Dependency-free alert classification for DevOps monitoring pipelines. */
final class HealthPolicy {
    static String classify(Number failures, Number attempts, Number p95Ms) {
        if (failures == null || attempts == null || p95Ms == null ||
            attempts.longValue() <= 0 || failures.longValue() < 0 ||
            failures.longValue() > attempts.longValue() || p95Ms.doubleValue() < 0) {
            throw new IllegalArgumentException('Invalid monitoring counters')
        }
        double errorRate = failures.doubleValue() / attempts.doubleValue()
        if (errorRate >= 0.05d || p95Ms.doubleValue() >= 1500d) return 'critical'
        if (errorRate >= 0.01d || p95Ms.doubleValue() >= 500d) return 'warning'
        return 'healthy'
    }
}

