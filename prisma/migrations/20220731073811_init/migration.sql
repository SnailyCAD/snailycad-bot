-- CreateTable
CREATE TABLE "DiscordGuild" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "apiUrl" TEXT,
    "apiToken" TEXT,

    CONSTRAINT "DiscordGuild_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DiscordGuild_name_key" ON "DiscordGuild"("name");
