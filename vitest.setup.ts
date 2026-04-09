/** Must run before `auth` module reads JWT secrets at load time. */
process.env.JWT_SECRET = 'test-access-secret-must-be-long-enough-for-hs256!!';
process.env.JWT_REFRESH_SECRET = 'test-refresh-secret-must-be-long-enough-for-hs256!';
