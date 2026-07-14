package com.resolveone.repository;

import com.resolveone.entity.Complaint;
import com.resolveone.entity.User;
import com.resolveone.enums.ComplaintPriority;
import com.resolveone.enums.ComplaintStatus;
import com.resolveone.enums.ResponsibleDepartment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;
import java.util.List;

public interface ComplaintRepository
        extends JpaRepository<Complaint, Long> {

    List<Complaint> findByCreatedByOrderByCreatedAtDesc(User createdBy);

    List<Complaint> findByResponsibleDepartmentOrderByCreatedAtDesc(
            ResponsibleDepartment responsibleDepartment
    );

    List<Complaint> findByStatusOrderByCreatedAtDesc(
            ComplaintStatus status
    );

    List<Complaint> findByPriorityOrderByCreatedAtDesc(
            ComplaintPriority priority
    );

    List<Complaint> findBySlaDeadlineBeforeAndStatusIn(
            LocalDateTime currentTime,
            List<ComplaintStatus> statuses
    );

    List<Complaint> findAllByOrderByCreatedAtDesc();
}