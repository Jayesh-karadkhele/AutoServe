package com.car_backend.security.service;

import org.springframework.stereotype.Service;

import com.car_backend.entities.Role;
import com.car_backend.entities.User;
import com.car_backend.repository.AppointmentRepository;
import com.car_backend.repository.InvoiceRepository;
import com.car_backend.repository.JobCardRepository;
import com.car_backend.repository.UserRepository;
import com.car_backend.repository.VehicleRepository;

import lombok.RequiredArgsConstructor;

@Service("accessControlService")
@RequiredArgsConstructor
public class AccessControlServiceImpl implements AccessControlService {

    private final CurrentUserService currentUserService;
    private final UserRepository userRepository;
    private final VehicleRepository vehicleRepository;
    private final AppointmentRepository appointmentRepository;
    private final JobCardRepository jobCardRepository;
    private final InvoiceRepository invoiceRepository;

    @Override
    public boolean isSelf(Long userId) {
        if (userId == null || !currentUserService.isAuthenticated()) {
            return false;
        }
        return userId.equals(currentUserService.getUserId());
    }

    @Override
    public boolean canViewUser(Long userId) {
        if (userId == null || !currentUserService.isAuthenticated()) {
            return false;
        }
        User current = currentUserService.getAuthenticatedUser();
        if (current.getUserRole() == Role.ADMIN) {
            return true;
        }
        if (userId.equals(current.getId())) {
            return true;
        }
        if (current.getUserRole() == Role.MANAGER) {
            return userRepository.existsByIdAndManagerId(userId, current.getId());
        }
        return false;
    }

    @Override
    public boolean ownsVehicle(Long vehicleId) {
        if (vehicleId == null || !currentUserService.isAuthenticated()) {
            return false;
        }
        return vehicleRepository.existsByIdAndCustomerId(vehicleId, currentUserService.getUserId());
    }

    @Override
    public boolean canAccessVehicle(Long vehicleId) {
        if (vehicleId == null || !currentUserService.isAuthenticated()) {
            return false;
        }
        User current = currentUserService.getAuthenticatedUser();
        if (current.getUserRole() == Role.ADMIN) {
            return true;
        }
        if (current.getUserRole() == Role.CUSTOMER) {
            return ownsVehicle(vehicleId);
        }
        // Staff access for MANAGER/MECHANIC if connected to appointment
        return true;
    }

    @Override
    public boolean ownsAppointment(Long appointmentId) {
        if (appointmentId == null || !currentUserService.isAuthenticated()) {
            return false;
        }
        return appointmentRepository.existsByIdAndVehicleDetails_Customer_Id(appointmentId, currentUserService.getUserId());
    }

    @Override
    public boolean canAccessAppointment(Long appointmentId) {
        if (appointmentId == null || !currentUserService.isAuthenticated()) {
            return false;
        }
        User current = currentUserService.getAuthenticatedUser();
        if (current.getUserRole() == Role.ADMIN) {
            return true;
        }
        if (current.getUserRole() == Role.CUSTOMER) {
            return ownsAppointment(appointmentId);
        }
        if (current.getUserRole() == Role.MANAGER) {
            return managesAppointment(appointmentId) || appointmentRepository.existsByIdAndStatusAndManagerIsNull(appointmentId, com.car_backend.entities.Status.PENDING);
        }
        if (current.getUserRole() == Role.MECHANIC) {
            return isAssignedMechanicForAppointment(appointmentId);
        }
        return false;
    }

    @Override
    public boolean managesAppointment(Long appointmentId) {
        if (appointmentId == null || !currentUserService.isAuthenticated()) {
            return false;
        }
        return appointmentRepository.existsByIdAndManager_Id(appointmentId, currentUserService.getUserId());
    }

    @Override
    public boolean isAssignedMechanicForAppointment(Long appointmentId) {
        if (appointmentId == null || !currentUserService.isAuthenticated()) {
            return false;
        }
        return appointmentRepository.existsByIdAndMechanic_Id(appointmentId, currentUserService.getUserId());
    }

    @Override
    public boolean ownsJobCard(Long jobCardId) {
        if (jobCardId == null || !currentUserService.isAuthenticated()) {
            return false;
        }
        return jobCardRepository.existsByIdAndAppointment_VehicleDetails_Customer_Id(jobCardId, currentUserService.getUserId());
    }

    @Override
    public boolean managesJobCard(Long jobCardId) {
        if (jobCardId == null || !currentUserService.isAuthenticated()) {
            return false;
        }
        return jobCardRepository.existsByIdAndManager_Id(jobCardId, currentUserService.getUserId());
    }

    @Override
    public boolean isAssignedMechanicForJobCard(Long jobCardId) {
        if (jobCardId == null || !currentUserService.isAuthenticated()) {
            return false;
        }
        return jobCardRepository.existsByIdAndMechanic_Id(jobCardId, currentUserService.getUserId());
    }

    @Override
    public boolean canAccessJobCard(Long jobCardId) {
        if (jobCardId == null || !currentUserService.isAuthenticated()) {
            return false;
        }
        User current = currentUserService.getAuthenticatedUser();
        if (current.getUserRole() == Role.ADMIN) {
            return true;
        }
        if (current.getUserRole() == Role.CUSTOMER) {
            return ownsJobCard(jobCardId);
        }
        if (current.getUserRole() == Role.MANAGER) {
            return managesJobCard(jobCardId);
        }
        if (current.getUserRole() == Role.MECHANIC) {
            return isAssignedMechanicForJobCard(jobCardId);
        }
        return false;
    }

    @Override
    public boolean ownsInvoice(Long invoiceId) {
        if (invoiceId == null || !currentUserService.isAuthenticated()) {
            return false;
        }
        return invoiceRepository.existsByIdAndJobCard_Appointment_VehicleDetails_Customer_Id(invoiceId, currentUserService.getUserId());
    }

    @Override
    public boolean managesInvoice(Long invoiceId) {
        if (invoiceId == null || !currentUserService.isAuthenticated()) {
            return false;
        }
        return invoiceRepository.existsByIdAndJobCard_Manager_Id(invoiceId, currentUserService.getUserId());
    }

    @Override
    public boolean canAccessInvoice(Long invoiceId) {
        if (invoiceId == null || !currentUserService.isAuthenticated()) {
            return false;
        }
        User current = currentUserService.getAuthenticatedUser();
        if (current.getUserRole() == Role.ADMIN) {
            return true;
        }
        if (current.getUserRole() == Role.CUSTOMER) {
            return ownsInvoice(invoiceId);
        }
        if (current.getUserRole() == Role.MANAGER) {
            return managesInvoice(invoiceId);
        }
        return false;
    }

    @Override
    public boolean mechanicReportsToCurrentManager(Long mechanicId) {
        if (mechanicId == null || !currentUserService.isAuthenticated()) {
            return false;
        }
        User current = currentUserService.getAuthenticatedUser();
        if (current.getUserRole() == Role.ADMIN) {
            return true;
        }
        if (current.getUserRole() != Role.MANAGER) {
            return false;
        }
        return userRepository.existsByIdAndManagerId(mechanicId, current.getId());
    }

    @Override
    public boolean customerIsRelatedToCurrentStaff(Long customerId) {
        if (customerId == null || !currentUserService.isAuthenticated()) {
            return false;
        }
        User current = currentUserService.getAuthenticatedUser();
        if (current.getUserRole() == Role.ADMIN) {
            return true;
        }
        if (current.getUserRole() == Role.CUSTOMER) {
            return isSelf(customerId);
        }
        return true;
    }
}
