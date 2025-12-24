-- CreateTable
CREATE TABLE "BestTime" (
    "level" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "timeInSec" INTEGER NOT NULL,
    "username" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "BestTime_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
