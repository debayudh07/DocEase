// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

abstract contract ReentrancyGuard {
    uint256 private constant _NOT_ENTERED = 1;
    uint256 private constant _ENTERED = 2;

    uint256 private _status;

    constructor() {
        _status = _NOT_ENTERED;
    }

    modifier nonReentrant() {
        require(_status != _ENTERED, "ReentrancyGuard: reentrant call");
        _status = _ENTERED;
        _;
        _status = _NOT_ENTERED;
    }
}

contract AppointmentEscrow is AccessControl, ReentrancyGuard {
    bytes32 public constant DOCTOR_ROLE = keccak256("DOCTOR_ROLE");
    bytes32 public constant PATIENT_ROLE = keccak256("PATIENT_ROLE");

    struct Appointment {
        address patient;
        address doctor;
        uint256 amount;
        bool isConfirmed;
        bool isCanceled;
    }

    mapping(uint256 => Appointment) public appointments;
    uint256 public appointmentCounter;

    event AppointmentCreated(uint256 indexed appointmentId, address patient, address doctor, uint256 amount);
    event AppointmentConfirmed(uint256 indexed appointmentId);
    event AppointmentCanceled(uint256 indexed appointmentId);
    event FundsReleased(uint256 indexed appointmentId, address doctor, uint256 amount);
    event FundsRefunded(uint256 indexed appointmentId, address patient, uint256 amount);

    constructor(address doctor) {
        grantRole(DOCTOR_ROLE, doctor);
        grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function createAppointment(address doctor) external payable onlyRole(PATIENT_ROLE) {
        require(msg.value > 0, "Amount must be greater than 0");
        require(hasRole(DOCTOR_ROLE, doctor), "Invalid doctor address");

        appointmentCounter++;
        appointments[appointmentCounter] = Appointment({
            patient: msg.sender,
            doctor: doctor,
            amount: msg.value,
            isConfirmed: false,
            isCanceled: false
        });

        emit AppointmentCreated(appointmentCounter, msg.sender, doctor, msg.value);
    }

    function confirmAppointment(uint256 appointmentId) external onlyRole(DOCTOR_ROLE) nonReentrant {
        Appointment storage appointment = appointments[appointmentId];
        require(appointment.doctor == msg.sender, "Only the assigned doctor can confirm");
        require(!appointment.isConfirmed, "Appointment already confirmed");
        require(!appointment.isCanceled, "Appointment is canceled");

        appointment.isConfirmed = true;
        payable(appointment.doctor).transfer(appointment.amount);

        emit AppointmentConfirmed(appointmentId);
        emit FundsReleased(appointmentId, appointment.doctor, appointment.amount);
    }

    function cancelAppointment(uint256 appointmentId) external nonReentrant {
        Appointment storage appointment = appointments[appointmentId];
        require(appointment.patient == msg.sender || hasRole(DOCTOR_ROLE, msg.sender), "Unauthorized");
        require(!appointment.isConfirmed, "Appointment already confirmed");
        require(!appointment.isCanceled, "Appointment already canceled");

        appointment.isCanceled = true;
        payable(appointment.patient).transfer(appointment.amount);

        emit AppointmentCanceled(appointmentId);
        emit FundsRefunded(appointmentId, appointment.patient, appointment.amount);
    }

    function getAppointment(uint256 appointmentId) external view returns (Appointment memory) {
        return appointments[appointmentId];
    }

    // Grant PATIENT_ROLE to a user (for testing purposes)
    function grantPatientRole(address patient) external onlyRole(DEFAULT_ADMIN_ROLE) {
        grantRole(PATIENT_ROLE, patient);
    }
}