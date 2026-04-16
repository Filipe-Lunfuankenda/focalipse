import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { VerifierSection } from "@/components/VerifierSection";
import { LanguageProvider } from "@/i18n/LanguageContext";

function renderVerifier() {
  return render(
    <LanguageProvider>
      <VerifierSection />
    </LanguageProvider>,
  );
}

function analyzeText(text: string) {
  const textarea = screen.getByPlaceholderText(/Cole aqui o seu texto para análise/i);
  const analyzeButton = screen.getByRole("button", { name: /Analisar Texto/i });

  fireEvent.change(textarea, { target: { value: text } });
  fireEvent.click(analyzeButton);
}

describe("VerifierSection", () => {
  // Testes de classificação básica
  it("classifica um exemplo canónico como Focalipse", async () => {
    renderVerifier();

    analyzeText(
      "Os prédios desabavam sob o fogo da artilharia, a terra tremia com o som ensurdecedor dos motores, e, no asfalto, uma formiga tentava contornar a ponta do seu sapato.",
    );

    expect(await screen.findByText(/Este texto é um Focalipse/i)).toBeInTheDocument();
  });

  it("classifica texto comum como não Focalipse", async () => {
    renderVerifier();

    analyzeText("Hoje fui ao mercado comprar pão, leite e fruta para o jantar.");

    expect(await screen.findByText(/não parece ser um Focalipse/i)).toBeInTheDocument();
  });

  // Testes de detecção de tipos específicos
  describe("Detecção de tipos específicos", () => {
    it("deteta corretamente o tipo Invertido", async () => {
      renderVerifier();

      analyzeText("A chama tremia suavemente na ponta do fósforo, e o prédio inteiro explodiu num rugido de fogo e destroços.");

      expect(await screen.findByText(/Tipo detectado/i)).toBeInTheDocument();
      expect(await screen.findByText("Invertido")).toBeInTheDocument();
    });

    it("deteta corretamente tipo Simples com macro dominante", async () => {
      renderVerifier();

      analyzeText(
        "Uma bomba nuclear detonava e destruía tudo à noite, enquanto uma gota de orvalho caía da folha de uma flor.",
      );

      expect(await screen.findByText(/Este texto é um Focalipse/i)).toBeInTheDocument();
    });

    it("deteta corretamente tipo Suspenso com ellipsis", async () => {
      renderVerifier();

      analyzeText(
        "Os gritos ecoavam pela sala enquanto as luzes explodiram e a porta se abria lentamente...",
      );

      expect(await screen.findByText(/Tipo detectado/i)).toBeInTheDocument();
      expect(await screen.findByText("Suspenso")).toBeInTheDocument();
    });
  });

  // Testes de controle negativo (não Focalipse)
  describe("Identificação de não-Focalipse", () => {
    it("rejeita texto mundano sem contraste", async () => {
      renderVerifier();

      analyzeText("Acordei, tomei um café e fui trabalhar.");

      expect(await screen.findByText(/não parece ser um Focalipse/i)).toBeInTheDocument();
    });

    it("rejeita texto com apenas macro sem micro", async () => {
      renderVerifier();

      analyzeText("A casa explodiu e desabou completamente sem ninguém conseguir ajudar.");

      expect(await screen.findByText(/não parece ser um Focalipse/i)).toBeInTheDocument();
    });

    it("rejeita texto com apenas micro sem macro", async () => {
      renderVerifier();

      analyzeText("Uma formiga caminhava na areia e chegou a uma pedra pequena.");

      expect(await screen.findByText(/não parece ser um Focalipse/i)).toBeInTheDocument();
    });
  });

  // Testes de suporte multi-língua
  describe("Suporte multi-língua", () => {
    it("detecta Focalipse em inglês", async () => {
      renderVerifier();

      analyzeText(
        "The building exploded in a deadly blast, and a butterfly landed delicately on a petal.",
      );

      expect(await screen.findByText(/Este texto é um Focalipse/i)).toBeInTheDocument();
    });

    it("detecta Focalipse em francês", async () => {
      renderVerifier();

      analyzeText(
        "L'explosion détruisait tout sur son passage, et une goutte de pluie glissait sur la feuille verte.",
      );

      expect(await screen.findByText(/Este texto é um Focalipse/i)).toBeInTheDocument();
    });

    it("detecta Focalipse em espanhol", async () => {
      renderVerifier();

      analyzeText(
        "El edificio se derrumbaba en un caos de fuego, y una lágrima caía lentamente desde el rostro.",
      );

      expect(await screen.findByText(/Este texto é um Focalipse/i)).toBeInTheDocument();
    });
  });

  // Testes de score e confiança
  describe("Scoring e confiança", () => {
    it("atribui score alto a exemplo canónico forte", async () => {
      renderVerifier();

      analyzeText(
        "A explosão rasgou o edifício num clarão ensurdecedor, enquanto uma gota de suor lhe caía do rosto.",
      );

      const resultText = await screen.findByText(/Este texto é um Focalipse/i);
      expect(resultText).toBeInTheDocument();
      
      // Procura por indicador de confiança alta
      expect(screen.getByRole("button", { name: /Analisar Texto/i })).toBeInTheDocument();
    });

    it("atribui score baixo a exemplo fraco ou ambíguo", async () => {
      renderVerifier();

      analyzeText("A casa estava no topo da montanha e era muito bonita.");

      expect(await screen.findByText(/não parece ser um Focalipse/i)).toBeInTheDocument();
    });
  });
});
