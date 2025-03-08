package org.example.controller.Auth;

public record ChangePasswordRequest(String oldPassword, String newPassword) {
}