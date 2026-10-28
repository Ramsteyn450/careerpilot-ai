import mongoose from 'mongoose';
import { MONGODB_URI } from '../config/constants';
import { AuthService } from '../services/authService';
import { ResumeService } from '../services/resumeService';
import { JobService } from '../services/jobService';
import { ApplicationService } from '../services/applicationService';
import { AnalyticsService } from '../services/analyticsService';
import { AIProviderService } from '../services/ai/aiProviderService';

async function runTestSuite() {
  console.log('=============================================');
  console.log('🧪 Starting CareerPilot AI Automated Tests...');
  console.log('=============================================');

  try {
    // 1. Connect DB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ [1/8] MongoDB Connected successfully.');

    // 2. Auth Service Test
    const testEmail = `test_${Date.now()}@careerpilot.ai`;
    const { user, accessToken } = await AuthService.register('Test Engineer', testEmail, 'Password123!');
    console.log(`✅ [2/8] Auth Register & Token Generation passed for ${user.email}`);

    const loginRes = await AuthService.login(testEmail, 'Password123!');
    if (!loginRes.accessToken) throw new Error('Login failed to return accessToken');
    console.log('✅ [2/8b] Auth Login & Password verification passed.');

    // 3. Resume Builder & Storage Test
    const resume = await ResumeService.createBlankResume(user.id, 'Test Automated Resume');
    if (!resume.id || resume.versions.length !== 1) throw new Error('Failed to create initial resume version');
    console.log(`✅ [3/8] Resume Creation & Parsing passed (Score: ${resume.latestScore}/100, Version: ${resume.versions[0].versionName})`);

    // 4. User-Controlled Alteration & Versioning Test
    const analysis = await AIProviderService.analyzeResume(resume.structuredData);
    const mockSuggestions = analysis.actionableRecommendations.slice(0, 2).map((s) => ({
      ...s,
      status: 'accepted' as const
    }));

    const updateRes = await ResumeService.applyApprovedChanges(
      user.id,
      resume.id,
      mockSuggestions,
      'Test AI Enhanced V2'
    );

    if (updateRes.resume.versions.length !== 2) {
      throw new Error('Version count mismatch after applying changes.');
    }
    console.log(`✅ [4/8] User-Controlled Alteration passed (Created Version 2: "${updateRes.newVersion.versionName}" with ${updateRes.newVersion.approvedChanges?.length} audit records)`);

    // 5. Job Recommendations Test
    const recommendations = await AIProviderService.recommendRoles(updateRes.resume.structuredData);
    if (recommendations.length === 0) throw new Error('Zero recommendations generated');
    console.log(`✅ [5/8] Job Role Recommendations passed (Top match: "${recommendations[0].title}" at ${recommendations[0].matchScore}% match)`);

    // 6. Job Description Matcher Test
    const jobPost = 'We need a Full-Stack Engineer with React, TypeScript, Node.js, and PostgreSQL expertise.';
    const matchResult = await AIProviderService.matchJobDescription(updateRes.resume.structuredData, jobPost);
    if (!matchResult.overallMatchScore || matchResult.requirementsBreakdown.length === 0) {
      throw new Error('Job description matching failed.');
    }
    console.log(`✅ [6/8] Job Description Matcher passed (${matchResult.overallMatchScore}% match, ${matchResult.requirementsBreakdown.length} requirement rows generated)`);

    // 7. Application Tracker Test
    const app = await ApplicationService.createApplication(user.id, {
      jobTitle: 'Senior Full-Stack Engineer',
      company: 'Stripe',
      location: 'Remote',
      status: 'applied',
      notes: 'Applied through CareerPilot AI portal.'
    });

    const updatedApp = await ApplicationService.updateApplication(user.id, app.id, {
      status: 'interview',
      notes: 'Technical screen scheduled.'
    });

    if (updatedApp.status !== 'interview') throw new Error('Failed to transition application status');
    console.log(`✅ [7/8] Application Tracker passed (Created and moved to stage: "${updatedApp.status}")`);

    // 8. Career Analytics Test
    const analytics = await AnalyticsService.getUserAnalytics(user.id);
    if (!analytics.hasResume || analytics.totalApplications !== 1) {
      throw new Error('Analytics failed to calculate true user metrics');
    }
    console.log(`✅ [8/8] Career Analytics passed (Resume score: ${analytics.resumeScore}, Applications tracked: ${analytics.totalApplications})`);

    // Cleanup test user & data
    await ResumeService.deleteResume(user.id, resume.id);
    await ApplicationService.deleteApplication(user.id, app.id);
    console.log('🧹 Cleanup of test records completed.');

    console.log('=============================================');
    console.log('🎉 ALL 8 CAREERPILOT AI TEST WORKFLOWS PASSED!');
    console.log('=============================================');
    process.exit(0);
  } catch (err: any) {
    console.error('❌ Test failed:', err);
    process.exit(1);
  }
}

runTestSuite();
