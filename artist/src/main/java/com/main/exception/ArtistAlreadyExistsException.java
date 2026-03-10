package com.main.exception;

public class ArtistAlreadyExistsException extends RuntimeException {
		
	public ArtistAlreadyExistsException(String message) {
        super(message);
    }
}
