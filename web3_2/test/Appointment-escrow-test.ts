import { expect } from "chai";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { ethers } from "hardhat";
import { AppointmentEscrow } from "../typechain-types";

describe("AppointmentEscrow", function () {
  let doctor: HardhatEthersSigner;
  let patient: HardhatEthersSigner;
  let otherAccount: HardhatEthersSigner;
  let appointmentEscrow: AppointmentEscrow;

  beforeEach(async function () {
    const [owner, addr1, addr2] = await ethers.getSigners();
    doctor = addr1;
    patient = addr2;
    otherAccount = owner;

    const AppointmentEscrowFactory = await ethers.getContractFactory("AppointmentEscrow");
    appointmentEscrow = await AppointmentEscrowFactory.deploy(doctor.address);

    // Grant PATIENT_ROLE to the patient
    await appointmentEscrow.grantPatientRole(patient.address);
  });

  it("Should create an appointment", async function () {
    const amount = ethers.parseEther("1.0");
    await expect(appointmentEscrow.connect(patient).createAppointment(doctor.address, { value: amount }))
      .to.emit(appointmentEscrow, "AppointmentCreated")
      .withArgs(1, patient.address, doctor.address, amount);

    const appointment = await appointmentEscrow.getAppointment(1);
    expect(appointment.patient).to.equal(patient.address);
    expect(appointment.doctor).to.equal(doctor.address);
    expect(appointment.amount).to.equal(amount);
    expect(appointment.isConfirmed).to.be.false;
    expect(appointment.isCanceled).to.be.false;
  });

  it("Should confirm an appointment and release funds", async function () {
    const amount = ethers.parseEther("1.0");
    await appointmentEscrow.connect(patient).createAppointment(doctor.address, { value: amount });

    const initialBalance = await ethers.provider.getBalance(doctor.address);
    await expect(appointmentEscrow.connect(doctor).confirmAppointment(1))
      .to.emit(appointmentEscrow, "AppointmentConfirmed")
      .withArgs(1)
      .to.emit(appointmentEscrow, "FundsReleased")
      .withArgs(1, doctor.address, amount);

    const finalBalance = await ethers.provider.getBalance(doctor.address);
    expect(finalBalance - initialBalance).to.equal(amount);

    const appointment = await appointmentEscrow.getAppointment(1);
    expect(appointment.isConfirmed).to.be.true;
  });

  it("Should cancel an appointment and refund funds", async function () {
    const amount = ethers.parseEther("1.0");
    await appointmentEscrow.connect(patient).createAppointment(doctor.address, { value: amount });

    const initialBalance = await ethers.provider.getBalance(patient.address);
    await expect(appointmentEscrow.connect(patient).cancelAppointment(1))
      .to.emit(appointmentEscrow, "AppointmentCanceled")
      .withArgs(1)
      .to.emit(appointmentEscrow, "FundsRefunded")
      .withArgs(1, patient.address, amount);

    const finalBalance = await ethers.provider.getBalance(patient.address);
    expect(finalBalance - initialBalance).to.equal(amount);

    const appointment = await appointmentEscrow.getAppointment(1);
    expect(appointment.isCanceled).to.be.true;
  });

  it("Should not allow unauthorized users to confirm or cancel", async function () {
    const amount = ethers.parseEther("1.0");
    await appointmentEscrow.connect(patient).createAppointment(doctor.address, { value: amount });

    await expect(appointmentEscrow.connect(otherAccount).confirmAppointment(1)).to.be.revertedWith(
      "Only the assigned doctor can confirm"
    );

    await expect(appointmentEscrow.connect(otherAccount).cancelAppointment(1)).to.be.revertedWith(
      "Unauthorized"
    );
  });
});