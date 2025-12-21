class ApiResponse {
  constructor(statusCode, data, message = "success") {
    this.statusCode = statusCode;  // http Status code (200, 201, etc.)
    this.data = data;              // actual data to send
    this.message = message;        // success message
    this.success = statusCode < 400; //tTrue if < 400 (success)
  }
}

export { ApiResponse };