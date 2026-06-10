In the create admin modal, when the response is 409, show the proper error message from api. see sample of such error {
"statusCode": 409,
"timestamp": "2026-06-10T18:59:09.521Z",
"path": "/api/admin/create",
"message": "User with this email already exists",
"error": "Conflict"
}

also, ensure that the toast is always showing cos when modal is open, the modal overlay always covers the toast
