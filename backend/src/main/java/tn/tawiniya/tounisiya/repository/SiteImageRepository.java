package tn.tawiniya.tounisiya.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.tawiniya.tounisiya.entity.ImageSection;
import tn.tawiniya.tounisiya.entity.SiteImage;

import java.util.List;

public interface SiteImageRepository extends JpaRepository<SiteImage, Long> {

    List<SiteImage> findBySectionOrderByDisplayOrderAsc(ImageSection section);

    List<SiteImage> findBySectionAndActiveTrueOrderByDisplayOrderAsc(ImageSection section);
}
