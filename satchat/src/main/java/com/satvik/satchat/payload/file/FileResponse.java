package com.satvik.satchat.payload.file;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FileResponse {
  String filename;
  String contentType;
  Long fileSize;
  String createdAt;
}
