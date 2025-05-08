/*
  Warnings:

  - You are about to alter the column `fechaHora` on the `agresiones` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `fechaHora` on the `atentados` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `fechaHoraVencTime` on the `atentados` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `fechaHoraUlOrCap` on the `atentados` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `fechaHora` on the `egresos` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `fechaHoraReintFueTerm` on the `egresos` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `fechaHoraReingPorRecap` on the `egresos` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `fechaHoraVencTime` on the `egresos` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `fechaHoraUlOrCap` on the `egresos` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `fechaHora` on the `elementos` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `fechaHora` on the `extramuros` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `fechaHoraReintegro` on the `extramuros` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `fechaHora` on the `habeas` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `fechaHoraCierre` on the `habeas` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `fechaHora` on the `huelgas` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `fechaHoraCierre` on the `huelgas` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `fechaHora` on the `impactos` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `fechaHoraIng` on the `ingresos` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `fechaNacimiento` on the `ingresos` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `fechaHora` on the `manifestaciones` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `fechaHora` on the `manifestaciones2` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `fechaHoraIng` on the `preingresos` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `fechaNacimiento` on the `preingresos` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `fechaHora` on the `prevenciones` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `fechaHora` on the `procedimientos` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `fechaHora` on the `reqexts` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `fechaHoraContestacion` on the `reqexts` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `fechaHora` on the `reqnos` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `fechaHora` on the `reqpositivos` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `fechaEgreso` on the `reqpositivos` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `fechaHoraIng` on the `reqpositivos` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `fechaHora` on the `riesgos` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `fechaHora` on the `sumarios` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `fechaHora` on the `traslados` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `fechaTraslado` on the `traslados` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.

*/
-- AlterTable
ALTER TABLE `agresiones` MODIFY `fechaHora` DATETIME NULL;

-- AlterTable
ALTER TABLE `atentados` MODIFY `fechaHora` DATETIME NULL,
    MODIFY `fechaHoraVencTime` DATETIME NULL,
    MODIFY `fechaHoraUlOrCap` DATETIME NULL;

-- AlterTable
ALTER TABLE `egresos` MODIFY `fechaHora` DATETIME NULL,
    MODIFY `fechaHoraReintFueTerm` DATETIME NULL,
    MODIFY `fechaHoraReingPorRecap` DATETIME NULL,
    MODIFY `fechaHoraVencTime` DATETIME NULL,
    MODIFY `fechaHoraUlOrCap` DATETIME NULL;

-- AlterTable
ALTER TABLE `elementos` MODIFY `fechaHora` DATETIME NOT NULL;

-- AlterTable
ALTER TABLE `extramuros` MODIFY `fechaHora` DATETIME NULL,
    MODIFY `fechaHoraReintegro` DATETIME NULL;

-- AlterTable
ALTER TABLE `habeas` MODIFY `fechaHora` DATETIME NULL,
    MODIFY `fechaHoraCierre` DATETIME NULL;

-- AlterTable
ALTER TABLE `huelgas` MODIFY `fechaHora` DATETIME NULL,
    MODIFY `fechaHoraCierre` DATETIME NULL;

-- AlterTable
ALTER TABLE `impactos` MODIFY `fechaHora` DATETIME NULL;

-- AlterTable
ALTER TABLE `ingresos` MODIFY `fechaHoraIng` DATETIME NULL,
    MODIFY `fechaNacimiento` DATETIME NULL;

-- AlterTable
ALTER TABLE `manifestaciones` MODIFY `fechaHora` DATETIME NULL;

-- AlterTable
ALTER TABLE `manifestaciones2` MODIFY `fechaHora` DATETIME NULL;

-- AlterTable
ALTER TABLE `preingresos` MODIFY `fechaHoraIng` DATETIME NULL,
    MODIFY `fechaNacimiento` DATETIME NULL;

-- AlterTable
ALTER TABLE `prevenciones` MODIFY `fechaHora` DATETIME NULL;

-- AlterTable
ALTER TABLE `procedimientos` MODIFY `fechaHora` DATETIME NULL;

-- AlterTable
ALTER TABLE `reqexts` MODIFY `fechaHora` DATETIME NULL,
    MODIFY `fechaHoraContestacion` DATETIME NULL;

-- AlterTable
ALTER TABLE `reqnos` MODIFY `fechaHora` DATETIME NULL;

-- AlterTable
ALTER TABLE `reqpositivos` MODIFY `fechaHora` DATETIME NULL,
    MODIFY `fechaEgreso` DATETIME NULL,
    MODIFY `fechaHoraIng` DATETIME NULL;

-- AlterTable
ALTER TABLE `riesgos` MODIFY `fechaHora` DATETIME NULL;

-- AlterTable
ALTER TABLE `sumarios` MODIFY `fechaHora` DATETIME NULL;

-- AlterTable
ALTER TABLE `traslados` MODIFY `fechaHora` DATETIME NULL,
    MODIFY `fechaTraslado` DATETIME NULL;

-- CreateTable
CREATE TABLE `Presupuestos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `movilId` INTEGER NOT NULL,
    `clienteId` INTEGER NOT NULL,
    `datosMovil` JSON NOT NULL,
    `datosCliente` JSON NOT NULL,
    `monto` DOUBLE NOT NULL,
    `estado` VARCHAR(191) NOT NULL DEFAULT 'Pendiente',
    `observaciones` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Presupuestos` ADD CONSTRAINT `Presupuestos_movilId_fkey` FOREIGN KEY (`movilId`) REFERENCES `Temas`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Presupuestos` ADD CONSTRAINT `Presupuestos_clienteId_fkey` FOREIGN KEY (`clienteId`) REFERENCES `Ingresos`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
