import React from 'react';
import styled from 'styled-components';
import { cn } from '@/lib/utils';
import { BaseComponentProps } from '@/types';

interface HandLoaderProps extends BaseComponentProps {
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
  showText?: boolean;
  customTexts?: string[];
}

const sizeMultipliers = {
  sm: 0.7,
  md: 1,
  lg: 1.3
};

export const HandLoader = ({
  size = 'md',
  fullScreen = false,
  showText = false,
  customTexts,
  className,
  ...props
}: HandLoaderProps) => {
  const defaultTexts = [
    "查看您的简历",
    "分析简历问题",
    "生成问题描述",
    "帮你搜索相关资料"
  ];

  const texts = customTexts || defaultTexts;

  const loader = (
    <StyledWrapper
      className={cn("hand-loader", className)}
      $size={sizeMultipliers[size]}
      {...props}
    >
      <div className="loader-container">
        <div className="🤚">
          <div className="👉" />
          <div className="👉" />
          <div className="👉" />
          <div className="👉" />
          <div className="🌴" />
          <div className="👍" />
        </div>         {showText && (
           <div className="text-loader">
             <div className="loader">
               <span className="fixed-text">面试官正在</span>
               <div className="words">
                 {texts.map((text, index) => (
                   <span key={index} className="word">{text}</span>
                 ))}
                 <span className="word">{texts[0]}</span>
               </div>
             </div>
           </div>
         )}
      </div>
    </StyledWrapper>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
        {loader}
      </div>
    );
  }

  return loader;
};

const StyledWrapper = styled.div<{ $size: number }>`
  transform: scale(${props => props.$size});
  display: inline-block;

  .loader-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
  }

  .text-loader {
    margin-top: 20px;
  }

  .text-loader .loader {
    --bg-color: transparent;
    background-color: var(--bg-color);
    padding: 0.5rem 1rem;
    border-radius: 1rem;
    color: hsl(var(--muted-foreground));
    font-family: "Inter", "Poppins", sans-serif;
    font-weight: 500;
    font-size: 20px;
    box-sizing: content-box;
    height: 32px;
    padding: 12px 16px;
    display: flex;
    align-items: baseline;
    border-radius: 8px;
    gap: 8px;
    line-height: 1.2;
  }

  .text-loader .fixed-text {
    color: hsl(var(--muted-foreground));
    font-weight: 600;
    white-space: nowrap;
    line-height: 1.2;
    display: flex;
    align-items: baseline;
  }

  .text-loader .words {
    overflow: hidden;
    position: relative;
    height: 32px;
  }

  .text-loader .words::after {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(
      transparent 0%,
      transparent 20%,
      transparent 80%,
      transparent 100%
    );
    z-index: 20;
    pointer-events: none;
  }

  .text-loader .word {
    display: block;
    height: 100%;
    padding-left: 8px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    color: hsl(var(--primary));
    font-weight: 600;
    animation: textRotate 10s infinite;
    white-space: nowrap;
    line-height: 1.2;
  }

  @keyframes textRotate {
    0% { transform: translateY(0%); }
    16% { transform: translateY(0%); }
    20% { transform: translateY(-100%); }
    36% { transform: translateY(-100%); }
    40% { transform: translateY(-200%); }
    56% { transform: translateY(-200%); }
    60% { transform: translateY(-300%); }
    76% { transform: translateY(-300%); }
    80% { transform: translateY(-400%); }
    96% { transform: translateY(-400%); }
    100% { transform: translateY(-500%); }
  }

  .🤚 {
    --skin-color: #E4C560;
    --tap-speed: 0.6s;
    --tap-stagger: 0.1s;
    position: relative;
    width: 80px;
    height: 60px;
    margin-left: 80px;
  }

  .🤚:before {
    content: '';
    display: block;
    width: 180%;
    height: 75%;
    position: absolute;
    top: 70%;
    right: 20%;
    background-color: black;
    border-radius: 40px 10px;
    filter: blur(10px);
    opacity: 0.3;
  }

  .🌴 {
    display: block;
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background-color: var(--skin-color);
    border-radius: 10px 40px;
  }

  .👍 {
    position: absolute;
    width: 120%;
    height: 38px;
    background-color: var(--skin-color);
    bottom: -18%;
    right: 1%;
    transform-origin: calc(100% - 20px) 20px;
    transform: rotate(-20deg);
    border-radius: 30px 20px 20px 10px;
    border-bottom: 2px solid rgba(0, 0, 0, 0.1);
    border-left: 2px solid rgba(0, 0, 0, 0.1);
  }

  .👍:after {
    width: 20%;
    height: 60%;
    content: '';
    background-color: rgba(255, 255, 255, 0.3);
    position: absolute;
    bottom: -8%;
    left: 5px;
    border-radius: 60% 10% 10% 30%;
    border-right: 2px solid rgba(0, 0, 0, 0.05);
  }

  .👉 {
    position: absolute;
    width: 80%;
    height: 35px;
    background-color: var(--skin-color);
    bottom: 32%;
    right: 64%;
    transform-origin: 100% 20px;
    animation-duration: calc(var(--tap-speed) * 2);
    animation-timing-function: ease-in-out;
    animation-iteration-count: infinite;
    transform: rotate(10deg);
  }

  .👉:before {
    content: '';
    position: absolute;
    width: 140%;
    height: 30px;
    background-color: var(--skin-color);
    bottom: 8%;
    right: 65%;
    transform-origin: calc(100% - 20px) 20px;
    transform: rotate(-60deg);
    border-radius: 20px;
  }

  .👉:nth-child(1) {
    animation-delay: 0;
    filter: brightness(70%);
    animation-name: tap-upper-1;
  }

  .👉:nth-child(2) {
    animation-delay: var(--tap-stagger);
    filter: brightness(80%);
    animation-name: tap-upper-2;
  }

  .👉:nth-child(3) {
    animation-delay: calc(var(--tap-stagger) * 2);
    filter: brightness(90%);
    animation-name: tap-upper-3;
  }

  .👉:nth-child(4) {
    animation-delay: calc(var(--tap-stagger) * 3);
    filter: brightness(100%);
    animation-name: tap-upper-4;
  }

  @keyframes tap-upper-1 {
    0%, 50%, 100% {
      transform: rotate(10deg) scale(0.4);
    }

    40% {
      transform: rotate(50deg) scale(0.4);
    }
  }

  @keyframes tap-upper-2 {
    0%, 50%, 100% {
      transform: rotate(10deg) scale(0.6);
    }

    40% {
      transform: rotate(50deg) scale(0.6);
    }
  }

  @keyframes tap-upper-3 {
    0%, 50%, 100% {
      transform: rotate(10deg) scale(0.8);
    }

    40% {
      transform: rotate(50deg) scale(0.8);
    }
  }

  @keyframes tap-upper-4 {
    0%, 50%, 100% {
      transform: rotate(10deg) scale(1);
    }

    40% {
      transform: rotate(50deg) scale(1);
    }
  }
`;

export default HandLoader;
