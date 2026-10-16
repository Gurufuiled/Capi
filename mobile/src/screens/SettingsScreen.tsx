import React, { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { Image } from 'expo-image';
import Constants from 'expo-constants';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../contexts/AuthContext';
import { authStore } from '../stores/authStore';
import { authService, apiUserToUserRow } from '../services/AuthService';
import { getProfile, updateProfile } from '../services/profileService';
import { apiUpload } from '../services/apiClient';
import { resolveAvatarUrl } from '../config';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { SettingsStackParamList } from '../navigation/types';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AvatarPickSheet, type AvatarPickResult } from '../components/AvatarPickSheet';
import { CapiSettingsRow } from '../components/settings/CapiSettingsRow';
import { CapiIcon } from '../components/capi/CapiIcon';
import { useTheme } from '../contexts/ThemeContext';
import { BRAND, BRAND_GRADIENT_END, BRAND_GRADIENT_START } from '../theme/brand';
import { createSettingsScreenStyles } from './settingsScreen.styles';
import { telegramAccountStore } from '../stores/telegramAccountStore';
import { getTelegramSettingsConnectionMeta } from './telegramAuth/telegramAuthPresentation';
import { friendlyApiError } from '../utils/apiErrorMessage';

/** Не перезапрашивать профиль чаще, чем раз в это время, если прошлая загрузка удалась. */
const PROFILE_REFRESH_MIN_INTERVAL_MS = 30_000;

/**
 * Settings (Capi V3): flat list without cards, four labelled groups,
 * account block with a camera badge on the avatar and a «Изменить фотографию» link.
 */
export function SettingsScreen() {
  const { colors: themeColors, resolvedScheme } = useTheme();
  const styles = useMemo(() => createSettingsScreenStyles(themeColors), [themeColors]);
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuth();
  const navigation =
    useNavigation<NativeStackNavigationProp<SettingsStackParamList>>();
  const [profile, setProfile] = useState<{
    display_name: string | null;
    last_name: string | null;
    avatar_url: string | null;
    handle: string | null;
    phone: string | null;
    bio: string | null;
    birthday: number | null;
  } | null>(() =>
    // Профиль из локальной сессии: экран рисуется сразу, а свежие данные подтягиваются в фоне
    user
      ? {
          display_name: user.display_name ?? null,
          last_name: user.last_name ?? null,
          avatar_url: user.avatar_url ?? null,
          handle: user.handle ?? null,
          phone: user.phone ?? null,
          bio: user.bio ?? null,
          birthday: user.birthday ?? null,
        }
      : null,
  );
  // Спиннер на весь экран — только если показать совсем нечего (раньше экран висел пустым, пока шёл запрос)
  const [loading, setLoading] = useState(() => !user);
  const [error, setError] = useState<string | null>(null);
  const lastLoadedAtRef = useRef(0);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [avatarSheetVisible, setAvatarSheetVisible] = useState(false);
  const telegramAuthStatus = telegramAccountStore((s) => s.authStatus);
  const telegramConnectionMeta = useMemo(
    () => getTelegramSettingsConnectionMeta(telegramAuthStatus),
    [telegramAuthStatus],
  );
  // «В сети» uses the brand online colors; other states keep their own tints (lightened on dark surfaces).
  const telegramBadge = useMemo(() => {
    if (telegramAuthStatus === 'ready') {
      const online = BRAND.online[resolvedScheme];
      return { label: telegramConnectionMeta.badge, bg: online.bg, text: online.text };
    }
    let text = telegramConnectionMeta.badgeText;
    if (resolvedScheme === 'dark') {
      // на тёмном фоне тёмный текст бейджа почти не виден — осветляем
      const lighter: Record<string, string> = {
        '#B45309': '#FBBF24',
        '#2563EB': '#7FB2FF',
        '#C62828': '#FF8A8F',
      };
      text = lighter[text] ?? text;
    }
    return { label: telegramConnectionMeta.badge, bg: telegramConnectionMeta.badgeBg, text };
  }, [resolvedScheme, telegramAuthStatus, telegramConnectionMeta]);

  const openTelegram = useCallback(() => {
    if (telegramAuthStatus !== 'ready') {
      navigation.navigate('TelegramAuth');
      return;
    }
    Alert.alert('Выйти из Telegram?', 'Диалоги Telegram исчезнут из общего списка чатов на этом устройстве.', [
      { text: 'Отмена', style: 'cancel' },
      {
        text: 'Выйти',
        style: 'destructive',
        onPress: () => {
          void telegramAccountStore.getState().resetTelegramSession();
        },
      },
    ]);
  }, [navigation, telegramAuthStatus]);

  const loadProfile = useCallback(async () => {
    setError(null);
    try {
      const p = await getProfile();
      lastLoadedAtRef.current = Date.now();
      setProfile({
        display_name: p.display_name,
        last_name: p.last_name ?? null,
        avatar_url: p.avatar_url,
        handle: p.handle,
        phone: p.phone,
        bio: p.bio ?? null,
        birthday: p.birthday ?? null,
      });
    } catch (e) {
      lastLoadedAtRef.current = 0; // после ошибки следующий вход на экран пробует снова
      setError(friendlyApiError(e, 'Не удалось загрузить профиль'));
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (Date.now() - lastLoadedAtRef.current < PROFILE_REFRESH_MIN_INTERVAL_MS) return;
      void loadProfile();
    }, [loadProfile])
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable
          onPress={() => navigation.navigate('EditProfile')}
          style={({ pressed }) => ({
            marginRight: 4,
            paddingHorizontal: 14,
            paddingVertical: 7,
            borderRadius: 17,
            backgroundColor: themeColors.inputBackgroundSolid,
            opacity: pressed ? 0.75 : 1,
          })}
        >
          <Text style={{ fontSize: 15, fontWeight: '700', color: themeColors.textPrimary }}>
            Изм.
          </Text>
        </Pressable>
      ),
    });
  }, [navigation, themeColors.inputBackgroundSolid, themeColors.textPrimary]);

  const syncAuthStore = useCallback((apiUser: Parameters<typeof apiUserToUserRow>[0]) => {
    const token = authStore.getState().accessToken;
    if (token) {
      authStore.getState().setSession(apiUserToUserRow(apiUser), token);
    }
  }, []);

  const handleAvatarTap = useCallback(() => {
    setAvatarSheetVisible(true);
  }, []);

  const handleAvatarPicked = useCallback(
    async (pick: AvatarPickResult) => {
      setUploadingAvatar(true);
      setError(null);
      try {
        const uploadRes = await apiUpload({
          uri: pick.uri,
          name: pick.name,
          type: pick.type,
        });
        const avatarUrlRaw = typeof uploadRes.url === 'string' ? uploadRes.url : (uploadRes as { url: string }).url;
        const updated = await updateProfile({ avatar_url: avatarUrlRaw });
        setProfile((prev) => (prev ? { ...prev, avatar_url: updated.avatar_url } : null));
        await authService.saveUserToLocal(updated);
        syncAuthStore(updated);
      } catch (e) {
        setError(friendlyApiError(e, 'Не удалось загрузить фото'));
      } finally {
        setUploadingAvatar(false);
      }
    },
    [syncAuthStore],
  );

  const avatarUrl = resolveAvatarUrl(profile?.avatar_url ?? user?.avatar_url);
  const profileTitle =
    [profile?.display_name?.trim(), profile?.last_name?.trim()].filter(Boolean).join(' ') ||
    profile?.display_name?.trim() ||
    user?.display_name?.trim() ||
    'Ваш профиль';
  const handleVal = profile?.handle?.trim().replace(/^@/, '') ?? '';
  const phoneLine = profile?.phone?.trim() || '';
  const handleLine = handleVal ? `@${handleVal}` : '';
  const initial = (profile?.display_name ?? user?.display_name ?? '')[0]?.toUpperCase() ?? '';

  const showComingSoon = useCallback((title: string) => {
    Alert.alert('Скоро', `${title}: раздел будет подключен позже.`);
  }, []);

  const appVersion = Constants.expoConfig?.version ?? '';
  const isDark = resolvedScheme === 'dark';
  const badgeBg = isDark ? '#262638' : '#6D3FE0';
  const badgeIcon = isDark ? '#C4B5FD' : '#FFFFFF';
  const danger = BRAND.danger[resolvedScheme];

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={themeColors.accent} />
      </View>
    );
  }

  return (
    <>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 96 }]}
          keyboardShouldPersistTaps="handled"
        >
          {error && (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <View style={styles.account}>
            <View style={styles.avatarWrap}>
              <Pressable
                onPress={() => navigation.navigate('MyProfile')}
                testID="settings-hero-avatar"
              >
                {avatarUrl ? (
                  <Image
                    source={{ uri: avatarUrl }}
                    style={styles.avatar}
                    contentFit="cover"
                    cachePolicy="disk"
                  />
                ) : (
                  <LinearGradient
                    colors={[BRAND.gradient[0], BRAND.gradient[1]]}
                    start={BRAND_GRADIENT_START}
                    end={BRAND_GRADIENT_END}
                    style={styles.avatarPlaceholder}
                  >
                    {initial ? (
                      <Text style={styles.avatarPlaceholderText}>{initial}</Text>
                    ) : (
                      <CapiIcon name="user" size={38} color="#FFFFFF" strokeWidth={1.6} />
                    )}
                  </LinearGradient>
                )}
                {uploadingAvatar && (
                  <View style={styles.avatarOverlay}>
                    <ActivityIndicator color="#FFFFFF" />
                  </View>
                )}
              </Pressable>
              <Pressable
                accessibilityLabel="Изменить фотографию"
                onPress={uploadingAvatar ? undefined : handleAvatarTap}
                disabled={uploadingAvatar}
                hitSlop={8}
                testID="settings-hero-camera"
                style={[styles.cameraBadge, { backgroundColor: badgeBg }]}
              >
                <CapiIcon name="camera" size={13} color={badgeIcon} strokeWidth={2} />
              </Pressable>
            </View>
            <Pressable onPress={() => navigation.navigate('MyProfile')}>
              <Text style={styles.name}>{profileTitle}</Text>
              <Text style={styles.meta} numberOfLines={2}>
                {phoneLine && handleLine
                  ? `${phoneLine} · ${handleLine}`
                  : phoneLine || handleLine || ' '}
              </Text>
            </Pressable>
            <Pressable
              onPress={uploadingAvatar ? undefined : handleAvatarTap}
              disabled={uploadingAvatar}
              style={({ pressed }) => [
                styles.changePhotoLink,
                (pressed || uploadingAvatar) && { opacity: 0.6 },
              ]}
            >
              <Text style={styles.changePhotoText}>Изменить фотографию</Text>
            </Pressable>
          </View>

          <Text style={styles.groupLabel}>Подключения</Text>
          <View style={styles.group}>
            <CapiSettingsRow
              first
              icon="send"
              title="Telegram"
              subtitle={telegramConnectionMeta.subtitle}
              badge={telegramBadge}
              onPress={openTelegram}
            />
            <CapiSettingsRow
              icon="grid"
              title="Сервисы"
              subtitle="Мини-приложения и боты"
              onPress={() => navigation.navigate('Services')}
            />
          </View>

          <Text style={styles.groupLabel}>Приложение</Text>
          <View style={styles.group}>
            <CapiSettingsRow
              first
              icon="palette"
              title="Оформление"
              subtitle="Тема приложения"
              onPress={() => navigation.navigate('Appearance')}
            />
            <CapiSettingsRow
              icon="messageSquare"
              title="Настройки чатов"
              onPress={() => navigation.navigate('ChatSettings')}
            />
            <CapiSettingsRow
              soon
              icon="bell"
              title="Уведомления и звуки"
              onPress={() => showComingSoon('Уведомления и звуки')}
            />
            <CapiSettingsRow
              soon
              icon="globe"
              title="Язык"
              onPress={() => showComingSoon('Язык')}
            />
            <CapiSettingsRow
              soon
              icon="chartPie"
              title="Данные и память"
              onPress={() => showComingSoon('Данные и память')}
            />
          </View>

          <Text style={styles.groupLabel}>Безопасность</Text>
          <View style={styles.group}>
            <CapiSettingsRow
              first
              soon
              icon="shield"
              title="Конфиденциальность"
              onPress={() => showComingSoon('Конфиденциальность')}
            />
            <CapiSettingsRow
              soon
              icon="lock"
              title="Пароль и безопасность"
              onPress={() => showComingSoon('Пароль и безопасность')}
            />
            <CapiSettingsRow
              soon
              icon="laptop"
              title="Устройства"
              onPress={() => showComingSoon('Устройства')}
            />
          </View>

          <Text style={styles.groupLabel}>Поддержка</Text>
          <View style={styles.group}>
            <CapiSettingsRow
              first
              icon="bug"
              title="Сообщить о баге"
              subtitle="Список ваших сообщений и новая заявка"
              onPress={() => navigation.navigate('FeedbackList', { kind: 'bug' })}
            />
            <CapiSettingsRow
              icon="lightbulb"
              title="Предложения"
              subtitle="Идеи по улучшению приложения"
              onPress={() => navigation.navigate('FeedbackList', { kind: 'suggestion' })}
            />
          </View>

          <Pressable
            accessibilityRole="button"
            onPress={logout}
            style={({ pressed }) => [styles.logoutRow, pressed && { opacity: 0.7 }]}
          >
            <CapiIcon name="logOut" size={20} color={danger} />
            <Text style={[styles.logoutText, { color: danger }]}>Выйти из аккаунта</Text>
          </Pressable>
          <Text style={styles.version}>{appVersion ? `Capi · ${appVersion}` : 'Capi'}</Text>
        </ScrollView>
      </KeyboardAvoidingView>
      <AvatarPickSheet
        visible={avatarSheetVisible}
        onClose={() => setAvatarSheetVisible(false)}
        onPick={(pick) => void handleAvatarPicked(pick)}
        subtitle="Фото профиля"
      />
    </>
  );
}
