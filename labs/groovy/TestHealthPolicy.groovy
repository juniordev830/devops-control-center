assert HealthPolicy.classify(0, 100, 200) == 'healthy'
assert HealthPolicy.classify(2, 100, 200) == 'warning'
assert HealthPolicy.classify(5, 100, 200) == 'critical'
assert HealthPolicy.classify(0, 100, 1500) == 'critical'
try {
    HealthPolicy.classify(5, 0, 100)
    assert false : 'Expected invalid argument'
} catch (IllegalArgumentException expected) {
    assert expected.message == 'Invalid monitoring counters'
}
println 'HealthPolicy checks passed'
