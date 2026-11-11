"use client";

interface SplitTextProps {
  children: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "span" | "p";
}

/**
 * SplitText
 *
 * Divide un string en spans individuales por palabra y letra,
 * permitiendo animaciones stagger con GSAP.
 *
 * Cada letra tiene la clase `.split-char` y cada palabra `.split-word`.
 * Usa overflow-hidden en el contenedor para efecto de reveal desde abajo.
 */
export default function SplitText({
  children,
  className = "",
  as: Tag = "span",
}: SplitTextProps) {
  const words = children.split(" ");

  return (
    <Tag className={className}>
      {words.map((word, wordIndex) => (
        <span key={wordIndex} className="split-word inline-block overflow-hidden">
          {word.split("").map((char, charIndex) => (
            <span
              key={`${wordIndex}-${charIndex}`}
              className="split-char inline-block"
              style={{ willChange: "transform, opacity" }}
            >
              {char}
            </span>
          ))}
          {wordIndex < words.length - 1 && (
            <span className="split-char inline-block">&nbsp;</span>
          )}
        </span>
      ))}
    </Tag>
  );
}
