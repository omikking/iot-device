-- CreateTable
CREATE TABLE "opticbolt_test_results" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "serial_number" VARCHAR(50) NOT NULL,
    "drawing_number" VARCHAR(100),
    "bolt_type" VARCHAR(50),
    "description" TEXT,
    "tested_at" TIMESTAMPTZ NOT NULL,
    "tested_by" VARCHAR(100) NOT NULL,
    "result" VARCHAR(10) NOT NULL,
    "fibre_check_1" BOOLEAN NOT NULL DEFAULT false,
    "fibre_check_2" BOOLEAN NOT NULL DEFAULT false,
    "psi_20" INTEGER,
    "psi_100" INTEGER,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "opticbolt_test_results_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "opticbolt_spectrums" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "test_result_id" UUID NOT NULL,
    "fbg_index" INTEGER NOT NULL,
    "amplitude_20" DECIMAL(12,6),
    "wavelength_20" DECIMAL(12,6),
    "amplitude_100" DECIMAL(12,6),
    "wavelength_100" DECIMAL(12,6),
    "peak_initial_nm" DECIMAL(12,6),
    "peak_20_nm" DECIMAL(12,6),
    "peak_100_nm" DECIMAL(12,6),
    "strain_20" DECIMAL(12,6),
    "strain_100" DECIMAL(12,6),
    "load_20" DECIMAL(12,6),
    "load_100" DECIMAL(12,6),
    "time_20_ms" INTEGER,
    "time_100_ms" INTEGER,
    "calibration_factor" DECIMAL(12,6),
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "opticbolt_spectrums_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "opticbolt_spectrums_test_result_id_fbg_index_key" ON "opticbolt_spectrums"("test_result_id", "fbg_index");

-- AddForeignKey
ALTER TABLE "opticbolt_spectrums" ADD CONSTRAINT "opticbolt_spectrums_test_result_id_fkey" FOREIGN KEY ("test_result_id") REFERENCES "opticbolt_test_results"("id") ON DELETE CASCADE ON UPDATE CASCADE;
