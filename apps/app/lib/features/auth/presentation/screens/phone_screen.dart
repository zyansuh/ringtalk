import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:uuid/uuid.dart';
import '../../../../core/network/api_client.dart';
import '../../../../core/storage/auth_storage.dart';
import '../../../../core/theme/app_colors.dart';

class PhoneScreen extends StatefulWidget {
  const PhoneScreen({super.key});

  @override
  State<PhoneScreen> createState() => _PhoneScreenState();
}

class _PhoneScreenState extends State<PhoneScreen> {
  final _formKey = GlobalKey<FormState>();
  final _phoneCtrl = TextEditingController();
  bool _isLoading = false;
  String? _error;

  String _normalizePhone(String raw) {
    final digits = raw.replaceAll(RegExp(r'\D'), '');
    if (digits.startsWith('0')) return '+82${digits.substring(1)}';
    return '+82$digits';
  }

  bool _isValidE164(String phone) {
    return RegExp(r'^\+[1-9]\d{7,14}$').hasMatch(phone);
  }

  Future<void> _submit() async {
    if (!(_formKey.currentState?.validate() ?? false)) return;
    final phone = _normalizePhone(_phoneCtrl.text);
    if (!_isValidE164(phone)) {
      setState(() => _error = '올바른 전화번호를 입력하세요.');
      return;
    }

    setState(() { _isLoading = true; _error = null; });
    try {
      const uuid = Uuid();
      final deviceId = uuid.v4();
      await AuthStorage.saveDeviceId(deviceId);

      await apiClient.post('/auth/request-otp', data: {
        'phoneNumber': phone,
        'deviceId': deviceId,
        'platform': 'android',
      });

      if (mounted) {
        context.push('/otp', extra: {'phone': phone, 'deviceId': deviceId});
      }
    } on DioException catch (e) {
      setState(() => _error = e.response?.data?['error']?['message'] ?? 'OTP 발송에 실패했습니다.');
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.bgLight,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: const BackButton(),
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const SizedBox(height: 8),
              Text('전화번호 입력', style: Theme.of(context).textTheme.headlineMedium),
              const SizedBox(height: 8),
              Text(
                '링톡에서 사용할 전화번호를 입력해 주세요.\n인증 문자가 발송됩니다.',
                style: Theme.of(context).textTheme.bodyMedium?.copyWith(color: AppColors.textSecondary),
              ),
              const SizedBox(height: 32),
              Form(
                key: _formKey,
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // 국가코드
                    Container(
                      height: 52,
                      padding: const EdgeInsets.symmetric(horizontal: 14),
                      decoration: BoxDecoration(
                        color: AppColors.surfaceSubtle,
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: AppColors.borderDefault, width: 1.5),
                      ),
                      alignment: Alignment.center,
                      child: const Text('🇰🇷 +82', style: TextStyle(fontSize: 15, fontWeight: FontWeight.w600)),
                    ),
                    const SizedBox(width: 8),
                    // 전화번호 입력
                    Expanded(
                      child: TextFormField(
                        controller: _phoneCtrl,
                        keyboardType: TextInputType.phone,
                        autofocus: true,
                        decoration: const InputDecoration(hintText: '010-0000-0000'),
                        validator: (v) {
                          if (v == null || v.trim().isEmpty) return '전화번호를 입력하세요.';
                          if (v.replaceAll(RegExp(r'\D'), '').length < 9) return '올바른 전화번호를 입력하세요.';
                          return null;
                        },
                      ),
                    ),
                  ],
                ),
              ),
              if (_error != null) ...[
                const SizedBox(height: 8),
                Text(_error!, style: const TextStyle(color: AppColors.error, fontSize: 12)),
              ],
              const SizedBox(height: 12),
              Text(
                '* 전화번호는 가입 및 친구 찾기에만 사용됩니다.',
                style: Theme.of(context).textTheme.bodySmall,
              ),
              const Spacer(),
              ElevatedButton(
                onPressed: _isLoading ? null : _submit,
                child: _isLoading
                    ? const SizedBox(height: 22, width: 22, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2.5))
                    : const Text('인증 문자 받기'),
              ),
              const SizedBox(height: 24),
            ],
          ),
        ),
      ),
    );
  }

  @override
  void dispose() {
    _phoneCtrl.dispose();
    super.dispose();
  }
}
