-- CreateTable
CREATE TABLE "opticbolt_test_results" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "serial_number" VARCHAR(50) NOT NULL,
    "drawing_number" VARCHAR(100),
    "bolt_type" VARCHAR(50),
    "description" VARCHAR(255),
    "tested_at" TIMESTAMPTZ NOT NULL,
    "tested_by" VARCHAR(100) NOT NULL,
    "result" VARCHAR(10) NOT NULL,
    "fibre_check_1" BOOLEAN NOT NULL DEFAULT false,
    "fibre_check_2" BOOLEAN NOT NULL DEFAULT false,
    "psi_20" INTEGER,
    "psi_100" INTEGER,
    "spectrum_index" INTEGER NOT NULL,
    "amplitude_20" DECIMAL(10,4),
    "wavelength_20" DECIMAL(10,4),
    "amplitude_100" DECIMAL(10,4),
    "wavelength_100" DECIMAL(10,4),
    "peak_initial_nm" DECIMAL(10,4),
    "peak_20_nm" DECIMAL(10,4),
    "peak_100_nm" DECIMAL(10,4),
    "strain_20" DECIMAL(10,6),
    "strain_100" DECIMAL(10,6),
    "load_20" DECIMAL(10,4),
    "load_100" DECIMAL(10,4),
    "time_20_ms" INTEGER,
    "time_100_ms" INTEGER,
    "calibration_factor" DECIMAL(10,6),
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "opticbolt_test_results_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "opticbolt_test_results_serial_number_tested_at_spectrum_ind_key" ON "opticbolt_test_results"("serial_number", "tested_at", "spectrum_index");
