import i18n from '@i18n';

export const Prompts = [
  i18n.t('Prompts.prompt1'),
  i18n.t('Prompts.prompt2'),
  i18n.t('Prompts.prompt3'),
  i18n.t('Prompts.prompt4'),
  i18n.t('Prompts.prompt5'),
  i18n.t('Prompts.prompt6'),
  i18n.t('Prompts.prompt7'),
  i18n.t('Prompts.prompt8'),
  i18n.t('Prompts.prompt9'),
  i18n.t('Prompts.prompt10'),
  i18n.t('Prompts.prompt11'),
  i18n.t('Prompts.prompt12'),
  i18n.t('Prompts.prompt13'),
  i18n.t('Prompts.prompt14'),
  i18n.t('Prompts.prompt15'),
  i18n.t('Prompts.prompt16'),
  i18n.t('Prompts.prompt17'),
  i18n.t('Prompts.prompt18'),
];

export function getRandomPromptIx(): number {
  return Math.floor(Math.random() * Prompts.length);
}
