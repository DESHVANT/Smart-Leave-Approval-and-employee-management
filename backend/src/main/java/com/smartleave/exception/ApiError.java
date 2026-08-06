package com.smartleave.exception;

import java.time.Instant;
import java.util.Map;
import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class ApiError {
    int status;
    String message;
    Instant timestamp;
    Map<String, String> fieldErrors;
}