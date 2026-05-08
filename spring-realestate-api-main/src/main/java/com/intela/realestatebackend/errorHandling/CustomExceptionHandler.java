package com.intela.realestatebackend.errorHandling;

import com.intela.realestatebackend.exceptions.BusinessException;
import com.intela.realestatebackend.exceptions.MissingAccessTokenException;
import com.intela.realestatebackend.exceptions.MissingRefreshTokenException;
import com.intela.realestatebackend.exceptions.UnauthorizedActionException;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class CustomExceptionHandler {
    @ExceptionHandler(MissingAccessTokenException.class)
    public ResponseEntity<String> onMissingAccessTokenException(MissingAccessTokenException exception) {
        return ResponseEntity.status(403).body("Missing access token" + exception.getMessage());
    }

    @ExceptionHandler(MissingRefreshTokenException.class)
    public ResponseEntity<String> onMissingRefreshTokenException(MissingRefreshTokenException exception) {
        return ResponseEntity.status(403).body("Missing refresh token" + exception.getMessage());
    }

    @ExceptionHandler(EntityNotFoundException.class)
    public ProblemDetail onNotFoundException(EntityNotFoundException exception) {
        return ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, exception.getMessage());
    }

    @ExceptionHandler(RuntimeException.class)
    public ProblemDetail onRuntimeException(RuntimeException exception) {
        return ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, exception.getMessage());
    }

    @ExceptionHandler(BusinessException.class)
    public ProblemDetail onBusinessException(BusinessException exception) {
        return ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, exception.getMessage());
    }

    @ExceptionHandler(UnauthorizedActionException.class)
    public ProblemDetail onUnauthorizedException(UnauthorizedActionException exception) {
        return ProblemDetail.forStatusAndDetail(HttpStatus.FORBIDDEN, exception.getMessage());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ProblemDetail onValidationException(MethodArgumentNotValidException exception) {
        String message = exception.getBindingResult().getFieldErrors().stream()
                .findFirst()
                .map(fieldError -> fieldError.getField() + " " + fieldError.getDefaultMessage())
                .orElse("Validation failed");
        return ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, message);
    }

    @ExceptionHandler(UsernameNotFoundException.class)
    public ProblemDetail onUsernameNotFoundException(UsernameNotFoundException exception) {
        return ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, exception.getMessage());
    }
}
