# AutoServe — API Integration Matrix

## 1. Authentication & Security Endpoints (`/api/auth`)
| HTTP Method | Endpoint | Access Role | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Register new customer account |
| POST | `/api/auth/login` | Public | Authenticate user & issue JWT + Refresh cookie |
| POST | `/api/auth/refresh` | Public | Rotate refresh token & issue new JWT access token |
| POST | `/api/auth/logout` | Authenticated | Revoke active session & clear cookies |
| POST | `/api/auth/logout-all` | Authenticated | Revoke all active user sessions across devices |
| POST | `/api/auth/forgot-password` | Public | Request password reset email/token |
| POST | `/api/auth/reset-password` | Public | Reset password using valid token |

## 2. Vehicle Endpoints (`/api/vehicles`)
| HTTP Method | Endpoint | Access Role | Description |
|---|---|---|---|
| POST | `/api/vehicles` | Customer, Admin | Add new vehicle |
| GET | `/api/vehicles/me` | Customer | Fetch current customer's vehicles |
| GET | `/api/vehicles/{vehicleId}` | Customer (Owner), Staff, Admin | Get vehicle details |
| PUT | `/api/vehicles/{vehicleId}` | Customer (Owner), Admin | Update vehicle details |
| DELETE | `/api/vehicles/{vehicleId}` | Customer (Owner), Admin | Soft-delete vehicle |

## 3. Appointment Endpoints (`/api/appointments`)
| HTTP Method | Endpoint | Access Role | Description |
|---|---|---|---|
| POST | `/api/appointments` | Customer, Admin | Book new service appointment |
| GET | `/api/appointments/me` | Customer | Fetch current customer's appointments |
| GET | `/api/appointments/manager/pending` | Manager, Admin | Fetch pending appointment queue |
| POST | `/api/appointments/{id}/claim` | Manager | Atomically claim pending appointment |
| PUT | `/api/appointments/{id}/approve` | Manager | Approve claimed appointment |
| PUT | `/api/appointments/{id}/reject` | Manager | Reject pending appointment |
| PUT | `/api/appointments/{id}/assign-mechanic/{mechanicId}` | Manager, Admin | Assign mechanic to appointment |

## 4. Job Card Endpoints (`/api/job_cards`)
| HTTP Method | Endpoint | Access Role | Description |
|---|---|---|---|
| POST | `/api/job_cards` | Manager, Admin | Create job card for approved appointment |
| GET | `/api/job_cards/{id}` | Customer (Owner), Staff, Admin | Get job card details |
| PUT | `/api/job_cards/{id}/start` | Mechanic (Assigned), Admin | Start work on job card |
| PUT | `/api/job_cards/{id}/complete` | Mechanic (Assigned), Admin | Complete work on job card |
| POST | `/api/job_cards/{id}/items` | Manager, Mechanic, Admin | Add part/labor item to job card |
| POST | `/api/job_cards/{id}/evidence` | Manager, Mechanic, Admin | Upload inspection evidence |
| PUT | `/api/job_cards/{id}/rate` | Customer (Owner), Admin | Rate completed service |

## 5. Invoice & Payment Endpoints (`/api/invoices`, `/api/payments`)
| HTTP Method | Endpoint | Access Role | Description |
|---|---|---|---|
| POST | `/api/invoices/generate/job_card/{jobCardId}` | Manager, Admin | Generate final invoice |
| GET | `/api/invoices/{id}` | Customer (Owner), Staff, Admin | Get invoice details |
| GET | `/api/invoices/{id}/download` | Customer (Owner), Staff, Admin | Download official PDF invoice |
| POST | `/api/invoices/{id}/create_payment_order` | Customer (Owner), Admin | Create Razorpay payment order |
| POST | `/api/invoices/{id}/verify_payment` | Customer (Owner), Admin | Verify payment signature |
| GET | `/api/invoices/{id}/payment-history` | Customer, Manager, Admin | Fetch invoice payment attempts |

## 6. Inventory Endpoints (`/api/inventory`)
| HTTP Method | Endpoint | Access Role | Description |
|---|---|---|---|
| GET | `/api/inventory` | Staff, Admin | List all spare parts |
| GET | `/api/inventory/search` | Staff, Admin | Search inventory by keyword |
| POST | `/api/inventory` | Admin | Create new inventory item |
| PUT | `/api/inventory/{id}` | Admin | Update inventory item details / stock |
| DELETE | `/api/inventory/{id}` | Admin | Delete inventory item |
