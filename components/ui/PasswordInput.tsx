import React, { forwardRef, useState } from 'react';
import { TextInput } from 'react-native';
import { Eye, EyeOff, Lock } from 'lucide-react-native';
import { Input, InputProps } from './Input';
import { colors } from '@/constants/colors';

export interface PasswordInputProps extends Omit<
  InputProps,
  'rightIcon' | 'onRightIconPress' | 'secureTextEntry'
> {
  showLockIcon?: boolean;
}

export const PasswordInput = forwardRef<TextInput, PasswordInputProps>(
  ({ showLockIcon = true, leftIcon, ...props }, ref) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const toggleVisibility = () => {
      setIsPasswordVisible((prev) => !prev);
    };

    return (
      <Input
        ref={ref}
        secureTextEntry={!isPasswordVisible}
        autoCapitalize="none"
        autoCorrect={false}
        leftIcon={
          leftIcon ?? (showLockIcon ? <Lock size={18} color={colors.neutral[400]} /> : undefined)
        }
        rightIcon={
          isPasswordVisible ? (
            <EyeOff size={20} color={colors.neutral[500]} />
          ) : (
            <Eye size={20} color={colors.neutral[500]} />
          )
        }
        onRightIconPress={toggleVisibility}
        {...props}
      />
    );
  }
);

PasswordInput.displayName = 'PasswordInput';

export default PasswordInput;
