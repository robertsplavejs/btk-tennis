"use client";

import {
  useRef,
  useState,
  type ChangeEvent,
} from "react";
import clsx from "clsx";

import { Card } from "@/components/ui/Card";
import { formatMatchScore } from "@/lib/formatMatchScore";
import type { TournamentMatch } from "@/types/match";
import {
  matchCardStyleOptions,
  type MatchCardStyle,
} from "@/types/matchCard";

import { MatchCardPreview } from "./MatchCardPreview";

type MatchCardEditorProps = {
  match: TournamentMatch;
};

const EXPORT_WIDTH = 1080;
const EXPORT_HEIGHT = 1920;

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
        return;
      }

      reject(new Error("Neizdevās nolasīt attēlu."));
    };

    reader.onerror = () => {
      reject(reader.error ?? new Error("Neizdevās nolasīt attēlu."));
    };

    reader.readAsDataURL(file);
  });
}

function loadImage(source: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();

    image.onload = () => resolve(image);
    image.onerror = () =>
      reject(new Error("Neizdevās ielādēt attēlu."));

    image.src = source;
  });
}

function drawCoverImage(
  context: CanvasRenderingContext2D,
  image: HTMLImageElement,
  width: number,
  height: number
) {
  const imageRatio = image.width / image.height;
  const canvasRatio = width / height;

  let sourceWidth = image.width;
  let sourceHeight = image.height;
  let sourceX = 0;
  let sourceY = 0;

  if (imageRatio > canvasRatio) {
    sourceWidth = image.height * canvasRatio;
    sourceX = (image.width - sourceWidth) / 2;
  } else {
    sourceHeight = image.width / canvasRatio;
    sourceY = (image.height - sourceHeight) / 2;
  }

  context.drawImage(
    image,
    sourceX,
    sourceY,
    sourceWidth,
    sourceHeight,
    0,
    0,
    width,
    height
  );
}

function drawRoundedRectangle(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  context.beginPath();
  context.roundRect(x, y, width, height, radius);
  context.closePath();
}

function drawCenteredText(
  context: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number
) {
  context.textAlign = "center";
  context.fillText(text, x, y);
}

function getWinner(match: TournamentMatch) {
  return match.winnerId === match.playerOne.id
    ? match.playerOne
    : match.playerTwo;
}

function drawPremiumCard(
  context: CanvasRenderingContext2D,
  match: TournamentMatch
) {
  const winner = getWinner(match);

  const gradient = context.createLinearGradient(
    0,
    0,
    0,
    EXPORT_HEIGHT
  );

  gradient.addColorStop(0, "rgba(0, 0, 0, 0.15)");
  gradient.addColorStop(0.55, "rgba(0, 0, 0, 0.25)");
  gradient.addColorStop(1, "rgba(0, 0, 0, 0.92)");

  context.fillStyle = gradient;
  context.fillRect(0, 0, EXPORT_WIDTH, EXPORT_HEIGHT);

  context.fillStyle = "#ffffff";
  context.font = "700 34px Arial";
  context.textAlign = "left";
  context.fillText("BTK SUMMER LEAGUE", 80, 105);

  context.font = "400 30px Arial";
  context.fillStyle = "rgba(255, 255, 255, 0.75)";
  context.fillText("Vīrieši A", 80, 155);

  context.fillStyle = "rgba(0, 0, 0, 0.48)";
  drawRoundedRectangle(
    context,
    70,
    1120,
    EXPORT_WIDTH - 140,
    620,
    56
  );
  context.fill();

  context.strokeStyle = "rgba(255, 255, 255, 0.18)";
  context.lineWidth = 3;
  context.stroke();

  context.fillStyle = "rgba(255, 255, 255, 0.65)";
  context.font = "700 28px Arial";
  drawCenteredText(
    context,
    "SPĒLES REZULTĀTS",
    EXPORT_WIDTH / 2,
    1205
  );

  context.fillStyle = "#ffffff";
  context.font = "700 42px Arial";
  drawCenteredText(
    context,
    `${match.playerOne.name}  pret  ${match.playerTwo.name}`,
    EXPORT_WIDTH / 2,
    1310
  );

  context.font = "800 88px Arial";
  drawCenteredText(
    context,
    formatMatchScore(match),
    EXPORT_WIDTH / 2,
    1450
  );

  context.strokeStyle = "rgba(255, 255, 255, 0.18)";
  context.beginPath();
  context.moveTo(150, 1525);
  context.lineTo(EXPORT_WIDTH - 150, 1525);
  context.stroke();

  context.fillStyle = "rgba(255, 255, 255, 0.6)";
  context.font = "600 26px Arial";
  drawCenteredText(
    context,
    "UZVARĒTĀJS",
    EXPORT_WIDTH / 2,
    1600
  );

  context.fillStyle = "#ffffff";
  context.font = "700 48px Arial";
  drawCenteredText(
    context,
    winner.name,
    EXPORT_WIDTH / 2,
    1675
  );

  context.fillStyle = "rgba(255, 255, 255, 0.6)";
  context.font = "600 25px Arial";
  drawCenteredText(
    context,
    "BĪRIŅA TENISA KLUBS",
    EXPORT_WIDTH / 2,
    1835
  );
}

function drawScoreCard(
  context: CanvasRenderingContext2D,
  match: TournamentMatch
) {
  const winner = getWinner(match);

  const gradient = context.createLinearGradient(
    0,
    0,
    0,
    EXPORT_HEIGHT
  );

  gradient.addColorStop(0, "rgba(0, 24, 45, 0.52)");
  gradient.addColorStop(1, "rgba(0, 0, 0, 0.92)");

  context.fillStyle = gradient;
  context.fillRect(0, 0, EXPORT_WIDTH, EXPORT_HEIGHT);

  context.fillStyle = "#ffffff";
  context.font = "700 34px Arial";
  context.textAlign = "left";
  context.fillText("BTK SUMMER LEAGUE", 80, 105);

  context.fillStyle = "rgba(255, 255, 255, 0.65)";
  context.font = "700 28px Arial";
  drawCenteredText(
    context,
    "GALA REZULTĀTS",
    EXPORT_WIDTH / 2,
    640
  );

  context.fillStyle = "#ffffff";
  context.font = "900 105px Arial";
  drawCenteredText(
    context,
    formatMatchScore(match),
    EXPORT_WIDTH / 2,
    800
  );

  context.font = "700 48px Arial";
  drawCenteredText(
    context,
    match.playerOne.name,
    EXPORT_WIDTH / 2,
    965
  );

  context.fillStyle = "rgba(255, 255, 255, 0.55)";
  context.font = "700 27px Arial";
  drawCenteredText(
    context,
    "PRET",
    EXPORT_WIDTH / 2,
    1035
  );

  context.fillStyle = "#ffffff";
  context.font = "700 48px Arial";
  drawCenteredText(
    context,
    match.playerTwo.name,
    EXPORT_WIDTH / 2,
    1110
  );

  context.fillStyle = "rgba(0, 0, 0, 0.42)";
  drawRoundedRectangle(
    context,
    150,
    1260,
    EXPORT_WIDTH - 300,
    250,
    44
  );
  context.fill();

  context.fillStyle = "rgba(255, 255, 255, 0.62)";
  context.font = "600 26px Arial";
  drawCenteredText(
    context,
    "UZVARĒTĀJS",
    EXPORT_WIDTH / 2,
    1350
  );

  context.fillStyle = "#ffffff";
  context.font = "700 48px Arial";
  drawCenteredText(
    context,
    winner.name,
    EXPORT_WIDTH / 2,
    1430
  );
}

function drawCleanCard(
  context: CanvasRenderingContext2D,
  match: TournamentMatch
) {
  const winner = getWinner(match);

  context.fillStyle = "rgba(245, 241, 232, 0.78)";
  context.fillRect(0, 0, EXPORT_WIDTH, EXPORT_HEIGHT);

  context.fillStyle = "#1f2937";
  context.font = "700 34px Arial";
  context.textAlign = "left";
  context.fillText("BTK SUMMER LEAGUE", 80, 105);

  context.fillStyle = "rgba(255, 255, 255, 0.92)";
  drawRoundedRectangle(
    context,
    70,
    1080,
    EXPORT_WIDTH - 140,
    650,
    56
  );
  context.fill();

  context.fillStyle = "#94a3b8";
  context.font = "700 27px Arial";
  context.fillText("SPĒLES REZULTĀTS", 130, 1180);

  context.fillStyle = "#0f4c81";
  context.font = "800 90px Arial";
  context.fillText(
    formatMatchScore(match),
    130,
    1320
  );

  context.fillStyle = "#111827";
  context.font = "700 39px Arial";
  context.fillText(match.playerOne.name, 130, 1440);
  context.fillText(match.playerTwo.name, 130, 1540);

  context.fillStyle = "#16a34a";
  context.font = "700 28px Arial";
  context.fillText(
    `Uzvarētājs: ${winner.name}`,
    130,
    1650
  );
}

async function createMatchCardPng(
  match: TournamentMatch,
  backgroundImageUrl: string | undefined,
  style: MatchCardStyle
) {
  const canvas = document.createElement("canvas");

  canvas.width = EXPORT_WIDTH;
  canvas.height = EXPORT_HEIGHT;

  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Canvas nav pieejams.");
  }

  if (backgroundImageUrl) {
    const backgroundImage = await loadImage(backgroundImageUrl);

    drawCoverImage(
      context,
      backgroundImage,
      EXPORT_WIDTH,
      EXPORT_HEIGHT
    );
  } else {
    context.fillStyle =
      style === "clean" ? "#f5f1e8" : "#171717";

    context.fillRect(
      0,
      0,
      EXPORT_WIDTH,
      EXPORT_HEIGHT
    );
  }

  if (style === "premium") {
    drawPremiumCard(context, match);
  }

  if (style === "score") {
    drawScoreCard(context, match);
  }

  if (style === "clean") {
    drawCleanCard(context, match);
  }

  return canvas.toDataURL("image/png", 1);
}

export function MatchCardEditor({
  match,
}: MatchCardEditorProps) {
  const [backgroundImageUrl, setBackgroundImageUrl] =
    useState<string | undefined>();

  const [selectedStyle, setSelectedStyle] =
    useState<MatchCardStyle>("premium");

  const [isReadingImage, setIsReadingImage] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const [exportMessage, setExportMessage] =
    useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      event.target.value = "";
      setExportMessage("Izvēlētais fails nav attēls.");
      return;
    }

    try {
      setIsReadingImage(true);
      setExportMessage(null);

      const dataUrl = await readFileAsDataUrl(file);

      setBackgroundImageUrl(dataUrl);
    } catch (error) {
      console.error("Image reading failed:", error);

      event.target.value = "";

      setExportMessage(
        "Neizdevās nolasīt izvēlēto attēlu."
      );
    } finally {
      setIsReadingImage(false);
    }
  }

  function removeImage() {
    setBackgroundImageUrl(undefined);
    setExportMessage(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  async function exportCard() {
    if (isExporting) {
      return;
    }

    try {
      setIsExporting(true);
      setExportMessage(null);

      const dataUrl = await createMatchCardPng(
        match,
        backgroundImageUrl,
        selectedStyle
      );

      const link = document.createElement("a");

      link.download = `btk-match-${match.id}.png`;
      link.href = dataUrl;

      document.body.appendChild(link);
      link.click();
      link.remove();

      setExportMessage("Match Card saglabāta kā PNG.");
    } catch (error) {
      console.error("Match Card export failed:", error);

      setExportMessage(
        "Neizdevās saglabāt Match Card."
      );
    } finally {
      setIsExporting(false);
    }
  }

  return (
    <div className="space-y-4">
      <MatchCardPreview
        match={match}
        backgroundImageUrl={backgroundImageUrl}
        cardStyle={selectedStyle}
      />

      <Card className="p-5">
        <h2 className="text-lg font-semibold text-black">
          Kartītes stils
        </h2>

        <div className="mt-4 grid grid-cols-3 gap-2">
          {matchCardStyleOptions.map((option) => {
            const isSelected = selectedStyle === option.id;

            return (
              <button
                key={option.id}
                type="button"
                onClick={() => {
                  setSelectedStyle(option.id);
                  setExportMessage(null);
                }}
                className={clsx(
                  "rounded-xl border px-3 py-3 text-left transition",
                  isSelected
                    ? "border-[var(--btk-primary)] bg-blue-50"
                    : "border-black/5 bg-neutral-50 hover:bg-neutral-100"
                )}
              >
                <span
                  className={clsx(
                    "block text-sm font-semibold",
                    isSelected
                      ? "text-[var(--btk-primary)]"
                      : "text-black"
                  )}
                >
                  {option.name}
                </span>
              </button>
            );
          })}
        </div>

        <p className="mt-3 text-sm leading-6 text-neutral-500">
          {
            matchCardStyleOptions.find(
              (option) => option.id === selectedStyle
            )?.description
          }
        </p>
      </Card>

      <Card className="p-5">
        <h2 className="text-lg font-semibold text-black">
          Fona foto
        </h2>

        <p className="mt-2 text-sm leading-6 text-neutral-500">
          Izvēlies vertikālu foto. Rezultāts un spēles
          informācija automātiski parādīsies virs attēla.
        </p>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="sr-only"
        />

        <div className="mt-5 space-y-3">
          <button
            type="button"
            disabled={isReadingImage}
            onClick={() => fileInputRef.current?.click()}
            className="flex h-11 w-full items-center justify-center rounded-xl bg-[var(--btk-primary)] px-5 text-sm font-semibold text-white transition-colors hover:bg-[var(--btk-primary-hover)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isReadingImage
              ? "Apstrādā foto..."
              : backgroundImageUrl
                ? "Nomainīt foto"
                : "Izvēlēties foto"}
          </button>

          {backgroundImageUrl && (
            <button
              type="button"
              onClick={removeImage}
              className="flex h-11 w-full items-center justify-center rounded-xl bg-neutral-100 px-5 text-sm font-semibold text-black transition-colors hover:bg-neutral-200"
            >
              Noņemt foto
            </button>
          )}
        </div>
      </Card>

      <Card className="p-5">
        <h2 className="text-lg font-semibold text-black">
          Saglabā kartīti
        </h2>

        <p className="mt-2 text-sm leading-6 text-neutral-500">
          Kartīte tiks saglabāta PNG formātā ar izmēru
          1080 × 1920 px.
        </p>

        <button
          type="button"
          onClick={exportCard}
          disabled={isExporting || isReadingImage}
          className="mt-5 flex h-12 w-full items-center justify-center rounded-xl bg-black px-5 text-sm font-semibold text-white transition-colors hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isExporting
            ? "Saglabā..."
            : "Saglabāt kā PNG"}
        </button>

        {exportMessage && (
          <p
            className="mt-4 rounded-2xl bg-neutral-100 px-4 py-3 text-sm text-neutral-700"
            role="status"
          >
            {exportMessage}
          </p>
        )}
      </Card>
    </div>
  );
}