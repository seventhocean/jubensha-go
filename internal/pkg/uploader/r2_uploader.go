package uploader

import (
	"bytes"
	"context"
	"fmt"
	"io"
	"log/slog"
	"sync"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/credentials"
	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/mlogclub/simple/common/strs"

	"bbs-go/internal/models/dto"
)

type R2Uploader struct {
	m          sync.Mutex
	client     *s3.Client
	currentCfg dto.UploadConfig
}

func (u *R2Uploader) PutObject(cfg dto.UploadConfig, key string, body io.Reader, opts *PutOptions) (string, error) {
	if err := u.initClient(cfg); err != nil {
		return "", err
	}
	putInput := &s3.PutObjectInput{
		Bucket: aws.String(cfg.R2.Bucket),
		Key:    aws.String(key),
		Body:   body,
	}
	if opts != nil {
		if opts.ContentLength > 0 {
			putInput.ContentLength = aws.Int64(opts.ContentLength)
		}
		if opts.ContentType != "" {
			putInput.ContentType = aws.String(opts.ContentType)
		}
		if opts.ContentDisposition != "" {
			putInput.ContentDisposition = aws.String(opts.ContentDisposition)
		}
	}
	if _, err := u.client.PutObject(context.Background(), putInput); err != nil {
		slog.Error("R2 PutObject failed", slog.Any("err", err), slog.String("bucket", cfg.R2.Bucket), slog.String("key", key))
		return "", fmt.Errorf("failed to upload object to R2: %w", err)
	}
	return buildR2URL(cfg, key), nil
}

func (u *R2Uploader) CopyImage(cfg dto.UploadConfig, originUrl string) (string, error) {
	data, ct, err := download(originUrl)
	if err != nil {
		return "", err
	}
	ct = NormalizeImageContentType(ct)
	key := GenerateImageKey(data, ct)
	opts := &PutOptions{ContentType: ct, ContentLength: int64(len(data))}
	return u.PutObject(cfg, key, bytes.NewReader(data), opts)
}

func (u *R2Uploader) initClient(cfg dto.UploadConfig) error {
	if !u.isCfgChange(cfg) {
		return nil
	}

	u.m.Lock()
	defer u.m.Unlock()

	if strs.IsAnyBlank(cfg.R2.AccountId, cfg.R2.Bucket, cfg.R2.AccessKeyId, cfg.R2.AccessKeySecret) {
		return fmt.Errorf("R2 configuration is incomplete: AccountId, Bucket, AccessKeyId, and AccessKeySecret are required")
	}

	endpoint := fmt.Sprintf("https://%s.r2.cloudflarestorage.com", cfg.R2.AccountId)

	awsCfg, err := config.LoadDefaultConfig(context.TODO(),
		config.WithRegion("auto"),
		config.WithCredentialsProvider(credentials.NewStaticCredentialsProvider(
			cfg.R2.AccessKeyId,
			cfg.R2.AccessKeySecret,
			"",
		)),
	)
	if err != nil {
		slog.Error("Failed to load AWS config for R2", slog.Any("err", err))
		return fmt.Errorf("failed to load AWS config for R2: %w", err)
	}

	u.client = s3.NewFromConfig(awsCfg, func(o *s3.Options) {
		o.BaseEndpoint = aws.String(endpoint)
		o.UsePathStyle = true
	})

	u.currentCfg = cfg
	return nil
}

func (u *R2Uploader) isCfgChange(cfg dto.UploadConfig) bool {
	if u.client == nil {
		return true
	}

	if u.currentCfg.R2.AccountId != cfg.R2.AccountId ||
		u.currentCfg.R2.Bucket != cfg.R2.Bucket ||
		u.currentCfg.R2.AccessKeyId != cfg.R2.AccessKeyId ||
		u.currentCfg.R2.AccessKeySecret != cfg.R2.AccessKeySecret ||
		u.currentCfg.R2.PublicHost != cfg.R2.PublicHost {
		return true
	}

	return false
}

func buildR2URL(cfg dto.UploadConfig, key string) string {
	if cfg.R2.PublicHost != "" {
		return fmt.Sprintf("%s/%s", cfg.R2.PublicHost, key)
	}
	// Default R2 public URL (requires public access enabled on bucket)
	return fmt.Sprintf("https://%s.r2.cloudflarestorage.com/%s/%s", cfg.R2.AccountId, cfg.R2.Bucket, key)
}

func BuildR2URL(cfg dto.UploadConfig, key string) string {
	return buildR2URL(cfg, key)
}
