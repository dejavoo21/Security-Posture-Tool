import { mockAssessments } from "../data/mockQuestions.js";
import { prisma } from "../lib/prisma.js";

export type ConversionStatus = "converted" | "already_converted" | "not_completed" | "not_found";
export type PublicSessionPreflightStatus = "claimable" | "already_converted" | "not_completed" | "expired" | "not_found";

export interface ConversionResult {
  status: ConversionStatus;
  publicSessionId: string;
  assessmentId?: string;
}

export interface PublicSessionOrganizationContext {
  organizationName?: string;
  industry?: string;
  size?: string;
}

export interface PublicSessionPreflightResult {
  status: PublicSessionPreflightStatus;
  publicSessionId: string;
  assessmentId?: string;
}

export const getPublicSessionOrganizationContext = async (
  publicSessionId?: string
): Promise<PublicSessionOrganizationContext> => {
  if (!publicSessionId) {
    return {};
  }

  const mockAssessment = mockAssessments.find((assessment) => assessment.id === publicSessionId);
  if (mockAssessment) {
    return {
      organizationName: mockAssessment.companyData.name,
      industry: mockAssessment.companyData.industry,
      size: mockAssessment.companyData.size,
    };
  }

  const session = await prisma.publicAssessmentSession.findUnique({
    where: { id: publicSessionId },
    select: {
      organizationName: true,
      industry: true,
      companySize: true,
    },
  });

  if (!session) {
    return {};
  }

  return {
    organizationName: session.organizationName ?? undefined,
    industry: session.industry ?? undefined,
    size: session.companySize ?? undefined,
  };
};

export const convertPublicSessionToWorkspaceAssessment = async (
  publicSessionId: string,
  organizationId: string,
  userId: string
): Promise<ConversionResult> => {
  const mockAssessment = mockAssessments.find((assessment) => assessment.id === publicSessionId);

  if (mockAssessment) {
    if (mockAssessment.responses.length === 0) {
      return { status: "not_completed", publicSessionId };
    }

    if (mockAssessment.convertedAt && mockAssessment.convertedAssessmentId) {
      return {
        status: "already_converted",
        publicSessionId,
        assessmentId: mockAssessment.convertedAssessmentId,
      };
    }

    const assessment = await prisma.assessment.create({
      data: {
        organizationId,
        overallScore: mockAssessment.overallScore,
        maturityLevel: mockAssessment.maturityLevel || "Unknown",
        riskLevel: mockAssessment.riskLevel || "Unknown",
        date: new Date(),
      },
    });

    mockAssessment.convertedAt = new Date().toISOString();
    mockAssessment.convertedAssessmentId = assessment.id;
    mockAssessment.convertedOrganizationId = organizationId;
    mockAssessment.convertedUserId = userId;

    return {
      status: "converted",
      publicSessionId,
      assessmentId: assessment.id,
    };
  }

  const session = await prisma.publicAssessmentSession.findUnique({
    where: { id: publicSessionId },
  });

  if (!session) {
    return { status: "not_found", publicSessionId };
  }

  if (session.status !== "COMPLETED") {
    return { status: "not_completed", publicSessionId };
  }

  if (session.convertedAt && session.convertedAssessmentId) {
    return {
      status: "already_converted",
      publicSessionId,
      assessmentId: session.convertedAssessmentId,
    };
  }

  const assessment = await prisma.assessment.create({
    data: {
      organizationId,
      overallScore: session.overallScore || 0,
      maturityLevel: session.maturityLevel || "Unknown",
      riskLevel: session.riskLevel || "Unknown",
      date: new Date(),
    },
  });

  await prisma.publicAssessmentSession.update({
    where: { id: publicSessionId },
    data: {
      convertedAt: new Date(),
      convertedAssessmentId: assessment.id,
      convertedOrganizationId: organizationId,
      convertedUserId: userId,
    },
  });

  return {
    status: "converted",
    publicSessionId,
    assessmentId: assessment.id,
  };
};

export const validatePublicSessionForConversion = async (
  publicSessionId?: string
): Promise<PublicSessionPreflightResult | null> => {
  if (!publicSessionId) {
    return null;
  }

  const mockAssessment = mockAssessments.find((assessment) => assessment.id === publicSessionId);
  if (mockAssessment) {
    if (mockAssessment.convertedAt && mockAssessment.convertedAssessmentId) {
      return {
        status: "already_converted",
        publicSessionId,
        assessmentId: mockAssessment.convertedAssessmentId,
      };
    }

    if (mockAssessment.responses.length === 0) {
      return { status: "not_completed", publicSessionId };
    }

    return { status: "claimable", publicSessionId };
  }

  const session = await prisma.publicAssessmentSession.findUnique({
    where: { id: publicSessionId },
    select: {
      status: true,
      expiresAt: true,
      convertedAt: true,
      convertedAssessmentId: true,
    },
  });

  if (!session) {
    return { status: "not_found", publicSessionId };
  }

  if (session.convertedAt && session.convertedAssessmentId) {
    return {
      status: "already_converted",
      publicSessionId,
      assessmentId: session.convertedAssessmentId,
    };
  }

  if (session.status === "EXPIRED" || session.expiresAt < new Date()) {
    return { status: "expired", publicSessionId };
  }

  if (session.status !== "COMPLETED") {
    return { status: "not_completed", publicSessionId };
  }

  return { status: "claimable", publicSessionId };
};
