import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Card } from '../components/Card';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';
import { supabase } from '../lib/supabase';

type Mode = 'signIn' | 'signUp';

export function AuthScreen() {
  const insets = useSafeAreaInsets();
  const [mode, setMode] = useState<Mode>('signIn');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const submit = useCallback(async () => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail || !password) {
      setError('Renseigne ton email et ton mot de passe.');
      return;
    }
    setLoading(true);
    setError(null);
    setInfo(null);

    if (mode === 'signIn') {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: trimmedEmail,
        password,
      });
      if (signInError) setError(signInError.message);
    } else {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: trimmedEmail,
        password,
      });
      if (signUpError) {
        setError(signUpError.message);
      } else if (!data.session) {
        setInfo('Compte créé. Vérifie tes emails pour confirmer ton adresse avant de te connecter.');
      }
    }

    setLoading(false);
  }, [email, password, mode]);

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={[styles.content, { paddingTop: insets.top + 40, paddingBottom: insets.bottom + 24 }]}>
        <View>
          <Text style={styles.title}>Coach Triathlon</Text>
          <Text style={styles.subtitle}>
            {mode === 'signIn' ? 'Connecte-toi pour retrouver ton plan.' : 'Crée ton compte pour démarrer.'}
          </Text>
        </View>

        <Card radius={18} padding={18} style={styles.card}>
          <View>
            <Text style={styles.label}>Email</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="toi@example.com"
              placeholderTextColor={colors.textMuted40}
              style={styles.input}
              autoCapitalize="none"
              autoComplete="email"
              keyboardType="email-address"
              editable={!loading}
            />
          </View>
          <View>
            <Text style={styles.label}>Mot de passe</Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              placeholderTextColor={colors.textMuted40}
              style={styles.input}
              secureTextEntry
              autoCapitalize="none"
              autoComplete="password"
              editable={!loading}
              onSubmitEditing={submit}
              returnKeyType="go"
            />
          </View>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          {info ? <Text style={styles.infoText}>{info}</Text> : null}

          <TouchableOpacity activeOpacity={0.85} style={styles.cta} onPress={submit} disabled={loading}>
            {loading ? (
              <ActivityIndicator color={colors.onAccent} />
            ) : (
              <Text style={styles.ctaText}>{mode === 'signIn' ? 'Se connecter' : "S'inscrire"}</Text>
            )}
          </TouchableOpacity>
        </Card>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            setMode((m) => (m === 'signIn' ? 'signUp' : 'signIn'));
            setError(null);
            setInfo(null);
          }}
          disabled={loading}
        >
          <Text style={styles.switchText}>
            {mode === 'signIn' ? 'Pas encore de compte ? ' : 'Déjà un compte ? '}
            <Text style={styles.switchLink}>{mode === 'signIn' ? "S'inscrire" : 'Se connecter'}</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    gap: 24,
  },
  title: {
    fontFamily: fonts.headingBold,
    fontSize: 28,
    color: colors.text,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: fonts.body,
    fontSize: 13.5,
    color: colors.textMuted45,
    textAlign: 'center',
    marginTop: 6,
  },
  card: {
    gap: 14,
  },
  label: {
    fontFamily: fonts.body,
    fontSize: 11.5,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    color: colors.textMuted40,
    marginBottom: 6,
  },
  input: {
    backgroundColor: colors.chip,
    borderWidth: 1,
    borderColor: colors.chipBorder,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    color: colors.text,
    fontFamily: fonts.body,
    fontSize: 14,
  },
  errorText: {
    fontFamily: fonts.body,
    fontSize: 12.5,
    color: colors.danger,
  },
  infoText: {
    fontFamily: fonts.body,
    fontSize: 12.5,
    color: colors.accent,
  },
  cta: {
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 14,
    minHeight: 48,
  },
  ctaText: {
    fontFamily: fonts.headingBold,
    fontSize: 15,
    color: colors.onAccent,
  },
  switchText: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.textMuted45,
    textAlign: 'center',
  },
  switchLink: {
    fontFamily: fonts.bodySemiBold,
    fontWeight: '600',
    color: colors.accent,
  },
});
