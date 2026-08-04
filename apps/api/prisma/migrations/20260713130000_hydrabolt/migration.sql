-- CreateTable
CREATE TABLE "hydrabolt" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "part_number" VARCHAR(100) NOT NULL,
    "drawing_number" VARCHAR(100),
    "bolt_length" DOUBLE PRECISION NOT NULL,
    "description" TEXT,
    "number_of_fbg" INTEGER NOT NULL,
    "position_of_fbgs" DOUBLE PRECISION[],
    "initial_wavelength" DOUBLE PRECISION[],
    "elastic_limit" DOUBLE PRECISION NOT NULL,
    "low_plastic_limit" DOUBLE PRECISION NOT NULL,
    "high_plastic_limit" DOUBLE PRECISION NOT NULL,
    "max_calibration_factor" DOUBLE PRECISION NOT NULL,
    "min_calibration_factor" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "hydrabolt_pkey" PRIMARY KEY ("id")
);
