package jj.stella.controller;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import jakarta.annotation.Resource;
import jj.stella.entity.dto.FilesDto;
import jj.stella.entity.dto.UploadDto;

@RestController
@RequestMapping("/api/upload")
public class UploadController {

	@Resource
	private String uploadPath;
	
	@PostMapping
	public ResponseEntity<?> uploadFile(UploadDto dto) {
		
		File folder = new File(uploadPath);
		if(!folder.exists())
			folder.mkdirs();
		
		List<String> uploadedFiles = new ArrayList<>();
		for(FilesDto file : dto.getFiles()) {
			try {
				
				String videoName = save(file.getVideo());
				String thumbnailName = save(file.getThumbnail());
				
				uploadedFiles.add(videoName);
				uploadedFiles.add(thumbnailName);
				
			} catch (IOException e) {
				e.printStackTrace();
				return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to upload files.");
			}
		}

		return ResponseEntity.ok().body("Uploaded files: " + uploadedFiles);
		
	}
	
	private String save(MultipartFile file) throws IOException {
		
		if(file.isEmpty())
			throw new IllegalStateException("Cannot upload empty file.");
		
		String filename = uploadPath + file.getOriginalFilename();
		try(
			InputStream is = file.getInputStream();
			OutputStream os = new FileOutputStream(filename)
		) {
			
			int bytesRead;
			byte[] buffer = new byte[8192];
			while((bytesRead = is.read(buffer)) != -1)
				os.write(buffer, 0, bytesRead);
			
		}
		
		return filename;
		
	}

}