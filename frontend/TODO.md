# TODO: Fix Frontend-Backend Connection Issues for "Darna Agadir" Platform

## Issues Identified:
1. **API URL Mismatch**: annonceService.js points to port 5000, but Laravel runs on 8000
2. **Database Configuration**: .env uses SQLite instead of MySQL with provided credentials
3. **CORS Middleware**: Custom middleware exists but may not be registered
4. **Authentication Headers**: Need to verify Sanctum token format
5. **Missing Environment Configuration**: Need proper .env setup

## Tasks:
- [ ] Update annonceService.js API URL from localhost:5000 to localhost:8000
- [ ] Create/update .env file with MySQL database configuration
- [ ] Register CorsMiddleware in HTTP Kernel
- [ ] Verify Sanctum authentication configuration
- [ ] Test API endpoints connectivity
- [ ] Update frontend environment variables if needed
- [ ] Run database migrations
- [ ] Test full authentication flow
