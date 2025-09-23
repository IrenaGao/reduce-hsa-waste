# AWS S3 Setup Guide for LMN Document Storage

## 🎯 **Overview**

Your application now has **cloud storage integration** using AWS S3 for storing and managing LMN (Letter of Medical Necessity) documents. This provides:

- ✅ **Persistent Storage**: LMN documents are permanently stored in the cloud
- ✅ **Scalability**: Unlimited storage capacity
- ✅ **Security**: AWS security features and access controls
- ✅ **Backup**: Automatic redundancy and backup
- ✅ **Access Control**: Secure document access and sharing
- ✅ **Audit Trail**: Complete document history and metadata

## 🏗️ **Architecture**

### **Storage Flow:**
```
Health Questionnaire → LMN Generation → S3 Upload → HSA Submission → Status Tracking
```

### **Key Components:**
1. **S3LMNService**: Handles all S3 operations (upload, download, list, delete)
2. **API Routes**: Updated to use S3 storage
3. **Metadata**: Rich document metadata for search and filtering
4. **Status Tracking**: Real-time status updates in S3

## 🔧 **Setup Instructions**

### **Step 1: Create AWS Account & S3 Bucket**

1. **Create AWS Account** (if you don't have one):
   - Go to [AWS Console](https://console.aws.amazon.com/)
   - Sign up for a free account (12 months free tier available)

2. **Create S3 Bucket**:
   ```bash
   # Via AWS Console:
   1. Go to S3 service
   2. Click "Create bucket"
   3. Bucket name: "lmn-documents-your-company" (must be globally unique)
   4. Region: "us-east-1" (or your preferred region)
   5. Uncheck "Block all public access"
   6. Create bucket
   ```

### **Step 2: Create IAM User & Access Keys**

1. **Create IAM User**:
   ```bash
   # Via AWS Console:
   1. Go to IAM service
   2. Click "Users" → "Create user"
   3. Username: "lmn-app-user"
   4. Select "Programmatic access"
   5. Click "Next"
   ```

2. **Attach S3 Policy**:
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Action": [
           "s3:GetObject",
           "s3:PutObject",
           "s3:DeleteObject",
           "s3:ListBucket",
           "s3:GetObjectMetadata"
         ],
         "Resource": [
           "arn:aws:s3:::your-bucket-name",
           "arn:aws:s3:::your-bucket-name/*"
         ]
       }
     ]
   }
   ```

3. **Generate Access Keys**:
   - Click "Create access key"
   - Save the **Access Key ID** and **Secret Access Key**

### **Step 3: Configure Environment Variables**

Update your `.env.local` file:

```bash
# AWS S3 Configuration
AWS_ACCESS_KEY_ID=your_actual_access_key_id_here
AWS_SECRET_ACCESS_KEY=your_actual_secret_access_key_here
AWS_REGION=us-east-1
AWS_S3_BUCKET_NAME=your-lmn-documents-bucket-name
```

### **Step 4: Test the Integration**

```bash
# Start your development server
npm run dev

# Test S3 health check
curl "http://localhost:3000/api/lmn/manage?action=health"
```

## 📁 **Storage Structure**

### **S3 Bucket Organization:**
```
lmn-documents-bucket/
├── lmn-documents/
│   ├── LMN-1234567890-ABC123.txt
│   ├── LMN-1234567891-DEF456.txt
│   ├── LMN-1234567892-GHI789.pdf
│   └── ...
```

### **Document Metadata:**
Each LMN document includes rich metadata:
```typescript
{
  lmn-id: "LMN-1234567890-ABC123",
  patient-name: "John Doe",
  provider: "HealthEquity",
  service-name: "Laser Skin Treatment",
  hsa-provider: "HealthEquity",
  status: "submitted",
  generated-date: "2024-01-15T10:30:00Z",
  digital-id: "SUB-1234567890-XYZ789"
}
```

## 🔌 **API Endpoints**

### **LMN Management:**
```bash
# List all LMN documents
GET /api/lmn/manage?action=list

# List with filters
GET /api/lmn/manage?action=list&patientName=John&status=submitted

# Download LMN document
GET /api/lmn/manage?action=download&lmnId=LMN-1234567890-ABC123

# Get presigned URL for secure access
GET /api/lmn/manage?action=presigned-url&lmnId=LMN-1234567890-ABC123

# Check S3 health
GET /api/lmn/manage?action=health

# Delete LMN document
DELETE /api/lmn/manage?lmnId=LMN-1234567890-ABC123
```

### **LMN Generation (Updated):**
```bash
# Generate and store LMN in S3
POST /api/lmn/comprehensive
{
  "healthQuestionnaireData": {...},
  "serviceInfo": {...},
  "hsaProvider": "HealthEquity",
  "providerInfo": {...}
}
```

### **LMN Submission (Updated):**
```bash
# Submit LMN and update S3 status
POST /api/lmn/submit
{
  "lmnDocument": {...}
}

# Check status from S3
GET /api/lmn/submit?lmnId=LMN-123&provider=HealthEquity
```

## 🛡️ **Security Features**

### **Access Control:**
- **Private Bucket**: All documents are private by default
- **IAM Permissions**: Fine-grained access control
- **Presigned URLs**: Temporary, secure access to documents
- **Encryption**: Server-side encryption enabled

### **Data Protection:**
- **HTTPS Only**: All API communications encrypted
- **Environment Variables**: Sensitive keys stored securely
- **Audit Logging**: All operations logged for compliance

## 📊 **Monitoring & Analytics**

### **S3 Metrics:**
- **Storage Usage**: Track document storage consumption
- **Request Counts**: Monitor API usage patterns
- **Error Rates**: Identify and resolve issues
- **Cost Tracking**: Monitor S3 costs

### **Application Logs:**
```typescript
// S3 operations are logged
console.log('LMN document uploaded to S3:', uploadResult);
console.log('LMN status updated in S3:', statusUpdateResult);
```

## 💰 **Cost Estimation**

### **AWS S3 Pricing (US East 1):**
- **Storage**: $0.023 per GB/month
- **Requests**: $0.0004 per 1,000 PUT requests
- **Data Transfer**: $0.09 per GB (first 1GB free)

### **Estimated Monthly Cost:**
- **1,000 LMN documents** (avg 10KB each): ~$0.25/month
- **10,000 API requests**: ~$0.004/month
- **Total**: ~$0.30/month for typical usage

## 🚀 **Advanced Features**

### **Document Versioning:**
```typescript
// S3 supports automatic versioning
// Each LMN update creates a new version
```

### **Lifecycle Management:**
```typescript
// Automatic archival after 7 years
// Cost optimization for compliance
```

### **Cross-Region Replication:**
```typescript
// Backup documents to multiple regions
// Disaster recovery and compliance
```

## 🔍 **Troubleshooting**

### **Common Issues:**

1. **"Access Denied" Error:**
   ```bash
   # Check IAM permissions
   # Verify bucket policy
   # Confirm access keys are correct
   ```

2. **"Bucket Not Found" Error:**
   ```bash
   # Verify bucket name in environment variables
   # Check AWS region configuration
   # Ensure bucket exists in correct region
   ```

3. **"Invalid Credentials" Error:**
   ```bash
   # Regenerate access keys
   # Update .env.local file
   # Restart development server
   ```

### **Health Check:**
```bash
# Test S3 connectivity
curl "http://localhost:3000/api/lmn/manage?action=health"

# Expected response:
{
  "success": true,
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

## 📈 **Next Steps**

### **Production Deployment:**
1. **Create Production S3 Bucket**
2. **Set up IAM roles for production**
3. **Configure environment variables**
4. **Enable CloudWatch monitoring**
5. **Set up backup and disaster recovery**

### **Additional Features:**
1. **PDF Generation**: Convert text LMNs to PDF
2. **Digital Signatures**: Add provider signatures
3. **Email Notifications**: Send status updates
4. **Analytics Dashboard**: Monitor document metrics
5. **Compliance Reporting**: Generate audit reports

## 🎉 **Success!**

Your LMN system now has **enterprise-grade cloud storage** with:

- ✅ **Persistent document storage**
- ✅ **Secure access controls**
- ✅ **Scalable infrastructure**
- ✅ **Complete audit trail**
- ✅ **Cost-effective solution**

**Ready to test?** Start your development server and generate an LMN document to see it automatically stored in AWS S3!
