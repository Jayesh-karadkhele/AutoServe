package com.car_backend.security.service;

public interface AccessControlService {

    boolean isSelf(Long userId);

    boolean canViewUser(Long userId);

    boolean ownsVehicle(Long vehicleId);

    boolean canAccessVehicle(Long vehicleId);

    boolean ownsAppointment(Long appointmentId);

    boolean canAccessAppointment(Long appointmentId);

    boolean managesAppointment(Long appointmentId);

    boolean isAssignedMechanicForAppointment(Long appointmentId);

    boolean ownsJobCard(Long jobCardId);

    boolean managesJobCard(Long jobCardId);

    boolean isAssignedMechanicForJobCard(Long jobCardId);

    boolean canAccessJobCard(Long jobCardId);

    boolean ownsInvoice(Long invoiceId);

    boolean managesInvoice(Long invoiceId);

    boolean canAccessInvoice(Long invoiceId);

    boolean mechanicReportsToCurrentManager(Long mechanicId);

    boolean customerIsRelatedToCurrentStaff(Long customerId);
}
