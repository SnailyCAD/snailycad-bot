-- CreateTable
CREATE TABLE "DiscordGuildMember" (
    "id" TEXT NOT NULL,
    "guildId" TEXT NOT NULL,
    "apiToken" TEXT,

    CONSTRAINT "DiscordGuildMember_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DiscordGuildMember_id_guildId_key" ON "DiscordGuildMember"("id", "guildId");
