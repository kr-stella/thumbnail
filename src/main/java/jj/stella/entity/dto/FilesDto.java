package jj.stella.entity.dto;

import org.springframework.web.multipart.MultipartFile;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FilesDto {
	
	private MultipartFile video;
	private MultipartFile thumbnail;
	
}