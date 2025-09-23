import { NextRequest, NextResponse } from 'next/server';
import { LMNGeneratorService, LMNDocument } from '../../services/lmnGeneratorService';
import { HSAProviderService } from '../../services/hsaProviderService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.lmnDocument) {
      return NextResponse.json(
        { error: 'LMN document is required' },
        { status: 400 }
      );
    }

    const lmnDocument: LMNDocument = body.lmnDocument;

    // Validate LMN document structure
    const requiredFields = ['id', 'provider', 'patientName', 'serviceName', 'content'];
    for (const field of requiredFields) {
      if (!lmnDocument[field as keyof LMNDocument]) {
        return NextResponse.json(
          { error: `Missing required field in LMN document: ${field}` },
          { status: 400 }
        );
      }
    }

    // Validate HSA provider
    const hsaProvider = HSAProviderService.getProvider(lmnDocument.provider);
    if (!hsaProvider) {
      return NextResponse.json(
        { error: `HSA provider '${lmnDocument.provider}' not found` },
        { status: 400 }
      );
    }

    // Submit LMN to HSA provider
    const submissionResult = await LMNGeneratorService.submitLMN(lmnDocument);

    if (!submissionResult.success) {
      return NextResponse.json(
        { 
          error: 'Failed to submit LMN',
          details: submissionResult.error
        },
        { status: 500 }
      );
    }

    // Update LMN document status
    const updatedLMNDocument = {
      ...lmnDocument,
      status: 'submitted' as const,
      digitalId: submissionResult.submissionId,
    };

    return NextResponse.json({
      success: true,
      lmnDocument: updatedLMNDocument,
      submissionId: submissionResult.submissionId,
      providerInfo: {
        name: hsaProvider.name,
        submissionMethod: HSAProviderService.getSubmissionMethod(lmnDocument.provider),
        contactInfo: hsaProvider.contactInfo,
      },
      message: 'LMN submitted successfully',
    });

  } catch (error) {
    console.error('Error submitting LMN:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to submit Letter of Medical Necessity',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lmnId = searchParams.get('lmnId');
    const provider = searchParams.get('provider');

    if (!lmnId || !provider) {
      return NextResponse.json(
        { error: 'LMN ID and provider are required' },
        { status: 400 }
      );
    }

    // Create a mock LMN document for status checking
    const mockLMNDocument: LMNDocument = {
      id: lmnId,
      provider,
      patientName: 'Unknown',
      serviceName: 'Unknown',
      generatedDate: new Date().toISOString(),
      status: 'submitted',
      content: '',
      digitalId: lmnId,
    };

    // Get LMN status from HSA provider
    const statusResult = await LMNGeneratorService.getLMNStatus(mockLMNDocument);

    return NextResponse.json({
      success: true,
      lmnId,
      status: statusResult.status,
      details: statusResult.details,
      lastChecked: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Error checking LMN status:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to check LMN status',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
