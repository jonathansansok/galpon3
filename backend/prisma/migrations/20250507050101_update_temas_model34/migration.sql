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
  - You are about to drop the column `imagen` on the `temas` table. All the data in the column will be lost.
  - You are about to drop the column `imagenDact` on the `temas` table. All the data in the column will be lost.
  - You are about to drop the column `imagenDer` on the `temas` table. All the data in the column will be lost.
  - You are about to drop the column `imagenIz` on the `temas` table. All the data in the column will be lost.
  - You are about to drop the column `imagenSen1` on the `temas` table. All the data in the column will be lost.
  - You are about to drop the column `imagenSen2` on the `temas` table. All the data in the column will be lost.
  - You are about to drop the column `imagenSen3` on the `temas` table. All the data in the column will be lost.
  - You are about to drop the column `imagenSen4` on the `temas` table. All the data in the column will be lost.
  - You are about to drop the column `imagenSen5` on the `temas` table. All the data in the column will be lost.
  - You are about to drop the column `imagenSen6` on the `temas` table. All the data in the column will be lost.
  - You are about to drop the column `imagenes` on the `temas` table. All the data in the column will be lost.
  - You are about to drop the column `pdf1` on the `temas` table. All the data in the column will be lost.
  - You are about to drop the column `pdf10` on the `temas` table. All the data in the column will be lost.
  - You are about to drop the column `pdf2` on the `temas` table. All the data in the column will be lost.
  - You are about to drop the column `pdf3` on the `temas` table. All the data in the column will be lost.
  - You are about to drop the column `pdf4` on the `temas` table. All the data in the column will be lost.
  - You are about to drop the column `pdf5` on the `temas` table. All the data in the column will be lost.
  - You are about to drop the column `pdf6` on the `temas` table. All the data in the column will be lost.
  - You are about to drop the column `pdf7` on the `temas` table. All the data in the column will be lost.
  - You are about to drop the column `pdf8` on the `temas` table. All the data in the column will be lost.
  - You are about to drop the column `pdf9` on the `temas` table. All the data in the column will be lost.
  - You are about to drop the column `word1` on the `temas` table. All the data in the column will be lost.
  - You are about to alter the column `establecimiento` on the `temas` table. The data in that column could be lost. The data in that column will be cast from `VarChar(200)` to `VarChar(191)`.
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
ALTER TABLE `temas` DROP COLUMN `imagen`,
    DROP COLUMN `imagenDact`,
    DROP COLUMN `imagenDer`,
    DROP COLUMN `imagenIz`,
    DROP COLUMN `imagenSen1`,
    DROP COLUMN `imagenSen2`,
    DROP COLUMN `imagenSen3`,
    DROP COLUMN `imagenSen4`,
    DROP COLUMN `imagenSen5`,
    DROP COLUMN `imagenSen6`,
    DROP COLUMN `imagenes`,
    DROP COLUMN `pdf1`,
    DROP COLUMN `pdf10`,
    DROP COLUMN `pdf2`,
    DROP COLUMN `pdf3`,
    DROP COLUMN `pdf4`,
    DROP COLUMN `pdf5`,
    DROP COLUMN `pdf6`,
    DROP COLUMN `pdf7`,
    DROP COLUMN `pdf8`,
    DROP COLUMN `pdf9`,
    DROP COLUMN `word1`,
    ADD COLUMN `anio` VARCHAR(191) NULL,
    ADD COLUMN `chasis` VARCHAR(191) NULL,
    ADD COLUMN `color` VARCHAR(191) NULL,
    ADD COLUMN `combustion` VARCHAR(191) NULL,
    ADD COLUMN `marca` VARCHAR(191) NULL,
    ADD COLUMN `modelo` VARCHAR(191) NULL,
    ADD COLUMN `motor` VARCHAR(191) NULL,
    ADD COLUMN `paisOrigen` VARCHAR(191) NULL,
    ADD COLUMN `patente` VARCHAR(191) NULL,
    ADD COLUMN `tipoPintura` VARCHAR(191) NULL,
    ADD COLUMN `tipoVehic` VARCHAR(191) NULL,
    ADD COLUMN `vin` VARCHAR(191) NULL,
    MODIFY `fechaHora` DATETIME(3) NULL,
    MODIFY `observacion` VARCHAR(191) NULL,
    MODIFY `email` VARCHAR(191) NULL,
    MODIFY `internosinvolucrado` VARCHAR(191) NULL,
    MODIFY `establecimiento` VARCHAR(191) NULL,
    MODIFY `modulo_ur` VARCHAR(191) NULL,
    MODIFY `pabellon` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `traslados` MODIFY `fechaHora` DATETIME NULL,
    MODIFY `fechaTraslado` DATETIME NULL;
