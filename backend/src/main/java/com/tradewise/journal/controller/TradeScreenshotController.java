package com.tradewise.journal.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/journal/screenshots")
public class TradeScreenshotController {

    private final Path uploadDirectory;

    public TradeScreenshotController(
            @Value("${tradewise.upload-dir:uploads/trades}") String uploadDir
    ) {
        this.uploadDirectory = Paths.get(uploadDir)
                .toAbsolutePath()
                .normalize();
    }

    @PostMapping
    public ResponseEntity<?> uploadScreenshot(
            @RequestParam("file") MultipartFile file
    ) {

        if (file == null || file.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Please select an image"));
        }

        String contentType = file.getContentType();

        if (contentType == null ||
                (!contentType.equals("image/png")
                && !contentType.equals("image/jpeg")
                && !contentType.equals("image/webp"))) {

            return ResponseEntity.badRequest()
                    .body(Map.of(
                            "message",
                            "Only PNG, JPEG and WebP images are allowed"
                    ));
        }

        if (file.getSize() > 5 * 1024 * 1024) {
            return ResponseEntity.badRequest()
                    .body(Map.of(
                            "message",
                            "Image size must be 5 MB or less"
                    ));
        }

        try {

            Files.createDirectories(uploadDirectory);

            String originalName = file.getOriginalFilename();

            String extension = ".png";

            if (originalName != null && originalName.contains(".")) {
                extension = originalName.substring(
                        originalName.lastIndexOf(".")
                ).toLowerCase();
            }

            String fileName =
                    UUID.randomUUID() + extension;

            Path targetPath =
                    uploadDirectory.resolve(fileName)
                            .normalize();

            if (!targetPath.startsWith(uploadDirectory)) {
                return ResponseEntity.badRequest()
                        .body(Map.of("message", "Invalid file name"));
            }

            Files.copy(
                    file.getInputStream(),
                    targetPath,
                    StandardCopyOption.REPLACE_EXISTING
            );

            String url =
                    "/uploads/trades/" + fileName;

            return ResponseEntity.ok(
                    Map.of(
                            "message", "Screenshot uploaded successfully",
                            "url", url
                    )
            );

        } catch (IOException e) {

            return ResponseEntity.internalServerError()
                    .body(Map.of(
                            "message",
                            "Failed to upload screenshot"
                    ));
        }
    }
}