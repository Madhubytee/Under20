import { StyleSheet } from 'react-native';
import { C } from '@/constants/theme';

export const authStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.cream,
  },
  flex: {
    flex: 1,
  },
  hero: {
    alignItems: 'center',
    gap: 6,
  },
  welcome: {
    fontSize: 13,
    fontWeight: '700',
    color: C.salmon,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: C.darkGreen,
    textAlign: 'center',
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 14,
    color: C.gray,
    textAlign: 'center',
    lineHeight: 20,
  },
  card: {
    backgroundColor: C.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: C.border,
    padding: 20,
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  field: {
    gap: 7,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: C.text,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.cream,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: C.border,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 8,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: C.text,
    padding: 0,
  },
  errorText: {
    fontSize: 13,
    color: C.salmon,
    textAlign: 'center',
  },
  button: {
    backgroundColor: C.darkGreen,
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 2,
  },
  buttonPressed: {
    opacity: 0.85,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '800',
    color: C.white,
    letterSpacing: 0.3,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: C.gray,
  },
  footerLink: {
    fontSize: 14,
    fontWeight: '700',
    color: C.darkGreen,
  },
});
