import { useEffect, useMemo, useRef } from 'react';
import type { RefObject } from 'react';
import Keyboard from 'react-simple-keyboard';
import 'simple-keyboard/build/css/index.css';

type VirtualKeyboardProps = {
  value: string;
  onChange: (next: string) => void;
  textareaRef?: RefObject<HTMLTextAreaElement | null>;
  layout: {
    default: string[];
  };
  /** For Urdu/Kashmiri */
  rtl?: boolean;
};

const VirtualKeyboard = ({ value, onChange, textareaRef, layout, rtl = false }: VirtualKeyboardProps) => {
  const keyboardRef = useRef<any>(null);

  const keyboardLayout = useMemo(() => ({ default: layout.default }), [layout.default]);

  // Keep keyboard input in sync when user types with physical keyboard.
  useEffect(() => {
    keyboardRef.current?.setInput?.(value);
  }, [value]);

  const insertTextAtCursor = (insert: string) => {
    const textarea = textareaRef?.current ?? null;
    if (!textarea) {
      onChange(value + insert);
      return;
    }

    const start = textarea.selectionStart ?? value.length;
    const end = textarea.selectionEnd ?? value.length;
    const next = value.slice(0, start) + insert + value.slice(end);
    onChange(next);

    // Restore focus and caret.
    requestAnimationFrame(() => {
      textarea.focus();
      const caret = start + insert.length;
      textarea.setSelectionRange(caret, caret);
    });
  };

  const backspaceAtCursor = () => {
    const textarea = textareaRef?.current ?? null;
    if (!textarea) {
      onChange(value.slice(0, -1));
      return;
    }

    const start = textarea.selectionStart ?? value.length;
    const end = textarea.selectionEnd ?? value.length;
    if (start !== end) {
      const next = value.slice(0, start) + value.slice(end);
      onChange(next);
      requestAnimationFrame(() => {
        textarea.focus();
        textarea.setSelectionRange(start, start);
      });
      return;
    }

    if (start <= 0) return;
    const next = value.slice(0, start - 1) + value.slice(end);
    onChange(next);
    requestAnimationFrame(() => {
      textarea.focus();
      const caret = start - 1;
      textarea.setSelectionRange(caret, caret);
    });
  };

  const handleKeyPress = (button: string) => {
    if (button === '{bksp}') return backspaceAtCursor();
    if (button === '{space}') return insertTextAtCursor(' ');
    if (button === '{enter}') return insertTextAtCursor('\n');
    // Ignore unsupported special buttons
    if (button.startsWith('{') && button.endsWith('}')) return;
    return insertTextAtCursor(button);
  };

  return (
    <div className={rtl ? 'rtl' : ''} dir={rtl ? 'rtl' : 'ltr'}>
      <Keyboard
        keyboardRef={(r) => (keyboardRef.current = r)}
        layout={keyboardLayout}
        onKeyPress={handleKeyPress}
        theme={'hg-theme-default hg-layout-default myTheme1'}
        display={{
          '{bksp}': '⌫',
          '{space}': 'Space',
          '{enter}': 'Enter',
        }}
      />
      <style>{`
        .myTheme1 {
          --key-bg: #0f172a;
        }
        .myTheme1 .hg-button {
          height: 44px;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          background: white;
          color: #0f172a;
          font-weight: 700;
        }
        .myTheme1 .hg-button:hover { background: #f1f5f9; }
        .myTheme1 .hg-button.hg-functionBtn { background: #0ea5e9; color: #000; border-color: #0ea5e9; }
        .myTheme1 .hg-button.hg-button-space { background: #e2e8f0; }
      `}</style>
    </div>
  );
};

export default VirtualKeyboard;
