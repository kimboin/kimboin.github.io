import { useEffect, useMemo, useRef, useState } from 'react';
import { trackEvent } from '../lib/analytics';
import { useLanguage } from '../lib/language';

const GIFT_TAGS = {
  birthday: 'birthday',
  anniversary: 'anniversary',
  housewarming: 'housewarming',
  practical: 'practical',
  handmade: 'handmade',
  custom: 'custom'
};

const DEFAULT_BIRTHDAY_GIFTS = [
  { name: '꽃다발', tags: [GIFT_TAGS.birthday, GIFT_TAGS.anniversary] },
  { name: '향수', tags: [GIFT_TAGS.birthday, GIFT_TAGS.anniversary] },
  { name: '무선 이어폰', tags: [GIFT_TAGS.birthday, GIFT_TAGS.practical] },
  { name: '케이크', tags: [GIFT_TAGS.birthday, GIFT_TAGS.anniversary] },
  { name: '기프트카드', tags: [GIFT_TAGS.birthday, GIFT_TAGS.housewarming, GIFT_TAGS.practical] },
  { name: '텀블러', tags: [GIFT_TAGS.housewarming, GIFT_TAGS.practical] },
  { name: '책', tags: [GIFT_TAGS.birthday, GIFT_TAGS.practical] },
  { name: '마사지건', tags: [GIFT_TAGS.birthday, GIFT_TAGS.practical] },
  { name: '실내 슬리퍼', tags: [GIFT_TAGS.housewarming, GIFT_TAGS.practical] },
  { name: '디퓨저', tags: [GIFT_TAGS.housewarming, GIFT_TAGS.anniversary] },
  { name: '수제 쿠폰북', tags: [GIFT_TAGS.birthday, GIFT_TAGS.anniversary, GIFT_TAGS.handmade] },
  { name: '캔들 워머', tags: [GIFT_TAGS.housewarming, GIFT_TAGS.practical] },
  { name: '호텔 식사권', tags: [GIFT_TAGS.birthday, GIFT_TAGS.anniversary] },
  { name: '와인잔 세트', tags: [GIFT_TAGS.housewarming, GIFT_TAGS.anniversary] },
  { name: '커피머신', tags: [GIFT_TAGS.housewarming, GIFT_TAGS.practical] },
  { name: '블루투스 스피커', tags: [GIFT_TAGS.birthday, GIFT_TAGS.housewarming, GIFT_TAGS.practical] },
  { name: '잠옷 세트', tags: [GIFT_TAGS.birthday, GIFT_TAGS.practical] },
  { name: '무드등', tags: [GIFT_TAGS.housewarming, GIFT_TAGS.anniversary] },
  { name: '에어프라이어', tags: [GIFT_TAGS.housewarming, GIFT_TAGS.practical] },
  { name: '목도리', tags: [GIFT_TAGS.birthday, GIFT_TAGS.handmade] },
  { name: '핸드크림 세트', tags: [GIFT_TAGS.birthday, GIFT_TAGS.anniversary, GIFT_TAGS.practical] },
  { name: '미니 화분', tags: [GIFT_TAGS.housewarming, GIFT_TAGS.anniversary] },
  { name: '포토북', tags: [GIFT_TAGS.birthday, GIFT_TAGS.anniversary, GIFT_TAGS.handmade] },
  { name: '레고 플라워', tags: [GIFT_TAGS.birthday, GIFT_TAGS.anniversary, GIFT_TAGS.handmade] },
  { name: '욕실 디스펜서 세트', tags: [GIFT_TAGS.housewarming, GIFT_TAGS.practical] },
  { name: '침구 세트', tags: [GIFT_TAGS.housewarming, GIFT_TAGS.practical] },
  { name: '스마트 워치 밴드', tags: [GIFT_TAGS.birthday, GIFT_TAGS.practical] },
  { name: '향초', tags: [GIFT_TAGS.anniversary, GIFT_TAGS.housewarming] },
  { name: '브런치 쿠폰', tags: [GIFT_TAGS.birthday, GIFT_TAGS.anniversary] },
  { name: '테이블 매트 세트', tags: [GIFT_TAGS.housewarming, GIFT_TAGS.practical] },
  { name: '키링 제작', tags: [GIFT_TAGS.birthday, GIFT_TAGS.handmade] },
  { name: '가습기', tags: [GIFT_TAGS.housewarming, GIFT_TAGS.practical] },
  { name: '홈카페 원두 세트', tags: [GIFT_TAGS.housewarming, GIFT_TAGS.birthday] },
  { name: '액자', tags: [GIFT_TAGS.housewarming, GIFT_TAGS.anniversary] },
  { name: '고급 볼펜', tags: [GIFT_TAGS.birthday, GIFT_TAGS.practical] },
  { name: '디저트 박스', tags: [GIFT_TAGS.birthday, GIFT_TAGS.anniversary] },
  { name: '머그컵 세트', tags: [GIFT_TAGS.housewarming, GIFT_TAGS.practical] },
  { name: '미니 공기청정기', tags: [GIFT_TAGS.housewarming, GIFT_TAGS.practical] },
  { name: '로브 가운', tags: [GIFT_TAGS.birthday, GIFT_TAGS.practical] },
  { name: '손편지 + 드로잉 카드', tags: [GIFT_TAGS.birthday, GIFT_TAGS.anniversary, GIFT_TAGS.handmade] },
  { name: '화장품 세트', tags: [GIFT_TAGS.birthday, GIFT_TAGS.anniversary, GIFT_TAGS.practical] },
  { name: '수저 세트', tags: [GIFT_TAGS.housewarming, GIFT_TAGS.practical] },
  { name: '한우 선물 세트', tags: [GIFT_TAGS.housewarming, GIFT_TAGS.anniversary] },
  { name: '과일 바구니', tags: [GIFT_TAGS.housewarming, GIFT_TAGS.anniversary] },
  { name: '프리미엄 차 세트', tags: [GIFT_TAGS.birthday, GIFT_TAGS.anniversary] },
  { name: '드립백 커피 세트', tags: [GIFT_TAGS.birthday, GIFT_TAGS.housewarming] },
  { name: '니트/맨투맨', tags: [GIFT_TAGS.birthday, GIFT_TAGS.practical] },
  { name: '운동화', tags: [GIFT_TAGS.birthday, GIFT_TAGS.practical] },
  { name: '쿠키 선물 박스', tags: [GIFT_TAGS.birthday, GIFT_TAGS.anniversary] },
  { name: '아이스크림 케이크', tags: [GIFT_TAGS.birthday, GIFT_TAGS.anniversary] },
  { name: '수제 과자 세트', tags: [GIFT_TAGS.birthday, GIFT_TAGS.housewarming] },
  { name: '수제 초콜릿 박스', tags: [GIFT_TAGS.birthday, GIFT_TAGS.anniversary] },
  { name: '베이커리 빵 세트', tags: [GIFT_TAGS.birthday, GIFT_TAGS.housewarming] },
  { name: '마카롱 세트', tags: [GIFT_TAGS.birthday, GIFT_TAGS.anniversary] },
  { name: '종합 영양제 세트', tags: [GIFT_TAGS.birthday, GIFT_TAGS.practical] },
  { name: '비타민 구미 세트', tags: [GIFT_TAGS.birthday, GIFT_TAGS.practical] }
];
const TAG_ORDER = [
  GIFT_TAGS.birthday,
  GIFT_TAGS.anniversary,
  GIFT_TAGS.housewarming,
  GIFT_TAGS.practical,
  GIFT_TAGS.handmade,
  GIFT_TAGS.custom
];
const PICK_DURATION_MS = 2000;
const PICK_INTERVAL_MS = 80;

const COPY = {
  ko: {
    kicker: 'BIRTHDAY GIFT PICKER',
    title: '생일선물 추천기',
    description: '생일선물 목록에서 랜덤으로 1개를 추천합니다.',
    listTitle: '선물 목록',
    addBoxTitle: '선물 추가',
    addBoxOpen: '선물 추가 열기',
    addBoxClose: '선물 추가 닫기',
    listCount: (count) => `총 ${count}개`,
    inputPlaceholder: '선물 이름 입력 (예: 블루투스 스피커)',
    add: '추가',
    pick: '랜덤 추천',
    picking: '추천 중...',
    remove: '삭제',
    empty: '선물 목록이 비어 있습니다. 선물을 추가해 주세요.',
    duplicate: '이미 목록에 있는 선물입니다.',
    pickedTitle: '추천 결과',
    pickedEmpty: '아직 추천 결과가 없습니다.',
    helper: '기본 목록 + 직접 추가한 목록에서 랜덤 추천됩니다.',
    filterTitle: '추첨에 포함할 태그',
    selectAllTags: '전체선택',
    poolCount: (count) => `현재 추첨 후보 ${count}개`,
    emptyPool: '선택한 태그에 맞는 선물이 없습니다. 태그를 다시 체크해 주세요.',
    tagLabel: {
      [GIFT_TAGS.birthday]: '생일',
      [GIFT_TAGS.anniversary]: '기념일',
      [GIFT_TAGS.housewarming]: '집들이',
      [GIFT_TAGS.practical]: '실용',
      [GIFT_TAGS.handmade]: '핸드메이드',
      [GIFT_TAGS.custom]: '직접 추가'
    }
  },
  en: {
    kicker: 'BIRTHDAY GIFT PICKER',
    title: 'Birthday Gift Picker',
    description: 'Randomly pick one birthday gift from your list.',
    listTitle: 'Gift List',
    addBoxTitle: 'Add Gift',
    addBoxOpen: 'Open add gift',
    addBoxClose: 'Close add gift',
    listCount: (count) => `Total ${count}`,
    inputPlaceholder: 'Type a gift name (e.g. Bluetooth speaker)',
    add: 'Add',
    pick: 'Pick Randomly',
    picking: 'Picking...',
    remove: 'Delete',
    empty: 'The gift list is empty. Add a gift first.',
    duplicate: 'This gift already exists in the list.',
    pickedTitle: 'Recommendation',
    pickedEmpty: 'No recommendation yet.',
    helper: 'Random picks are made from default + custom gifts.',
    filterTitle: 'Tags Included in Draw',
    selectAllTags: 'Select all',
    poolCount: (count) => `${count} gifts in current draw pool`,
    emptyPool: 'No gifts match selected tags. Check different tags.',
    tagLabel: {
      [GIFT_TAGS.birthday]: 'Birthday',
      [GIFT_TAGS.anniversary]: 'Anniversary',
      [GIFT_TAGS.housewarming]: 'Housewarming',
      [GIFT_TAGS.practical]: 'Practical',
      [GIFT_TAGS.handmade]: 'Handmade',
      [GIFT_TAGS.custom]: 'Custom'
    }
  }
};

function BirthdayGiftPickerPage() {
  const { language } = useLanguage();
  const copy = COPY[language] || COPY.ko;

  const [gifts, setGifts] = useState(DEFAULT_BIRTHDAY_GIFTS);
  const [inputValue, setInputValue] = useState('');
  const [pickedGift, setPickedGift] = useState(null);
  const [errorText, setErrorText] = useState('');
  const [isPicking, setIsPicking] = useState(false);
  const [isAddBoxOpen, setIsAddBoxOpen] = useState(false);
  const [selectedTags, setSelectedTags] = useState(() => ({
    [GIFT_TAGS.birthday]: true,
    [GIFT_TAGS.anniversary]: true,
    [GIFT_TAGS.housewarming]: true,
    [GIFT_TAGS.practical]: true,
    [GIFT_TAGS.handmade]: true,
    [GIFT_TAGS.custom]: true
  }));
  const timersRef = useRef({ spinInterval: null, finishTimeout: null });

  const normalizedSet = useMemo(() => new Set(gifts.map((gift) => gift.name.trim().toLowerCase())), [gifts]);
  const filteredGifts = useMemo(
    () => gifts.filter((gift) => gift.tags.some((tag) => selectedTags[tag])),
    [gifts, selectedTags]
  );
  const allTagsSelected = useMemo(() => TAG_ORDER.every((tag) => selectedTags[tag]), [selectedTags]);

  function getTagLabel(tag) {
    return copy.tagLabel?.[tag] || tag;
  }

  useEffect(
    () => () => {
      if (timersRef.current.spinInterval) {
        clearInterval(timersRef.current.spinInterval);
      }
      if (timersRef.current.finishTimeout) {
        clearTimeout(timersRef.current.finishTimeout);
      }
    },
    []
  );

  function onAddGift(event) {
    event.preventDefault();
    if (isPicking) {
      return;
    }
    const nextGift = inputValue.trim();

    if (!nextGift) {
      return;
    }

    if (normalizedSet.has(nextGift.toLowerCase())) {
      setErrorText(copy.duplicate);
      return;
    }

    setGifts((prev) => [...prev, { name: nextGift, tags: [GIFT_TAGS.custom] }]);
    setInputValue('');
    setErrorText('');
    trackEvent('tool_custom_save', {
      tool_name: 'birthday-gift-picker',
      source: 'manual-add'
    });
  }

  function onToggleTag(tag) {
    if (isPicking) {
      return;
    }

    setSelectedTags((prev) => {
      const next = { ...prev, [tag]: !prev[tag] };
      return next;
    });
  }

  function onToggleAllTags() {
    if (isPicking) {
      return;
    }
    const nextChecked = !allTagsSelected;
    const nextState = TAG_ORDER.reduce((acc, tag) => {
      acc[tag] = nextChecked;
      return acc;
    }, {});
    setSelectedTags(nextState);
  }

  function onDeleteGift(index) {
    if (isPicking) {
      return;
    }
    const deletedGift = gifts[index];
    setGifts((prev) => prev.filter((_, giftIndex) => giftIndex !== index));
    setErrorText('');

    if (pickedGift?.name === deletedGift.name) {
      setPickedGift(null);
    }

    trackEvent('tool_custom_delete', {
      tool_name: 'birthday-gift-picker',
      source: 'manual-delete'
    });
  }

  function onPickGift() {
    if (isPicking || filteredGifts.length === 0) {
      setPickedGift(null);
      return;
    }
    setIsPicking(true);
    setErrorText('');

    trackEvent('tool_generate', {
      tool_name: 'birthday-gift-picker',
      source_count: filteredGifts.length,
      duration_ms: PICK_DURATION_MS
    });

    const giftPool = [...filteredGifts];
    timersRef.current.spinInterval = setInterval(() => {
      const rollingGift = giftPool[Math.floor(Math.random() * giftPool.length)];
      setPickedGift(rollingGift);
    }, PICK_INTERVAL_MS);

    timersRef.current.finishTimeout = setTimeout(() => {
      if (timersRef.current.spinInterval) {
        clearInterval(timersRef.current.spinInterval);
        timersRef.current.spinInterval = null;
      }
      const picked = giftPool[Math.floor(Math.random() * giftPool.length)];
      setPickedGift(picked);
      setIsPicking(false);
    }, PICK_DURATION_MS);
  }

  return (
    <section className="section">
      <div className="container tool-layout">
        <header className="hero tool-hero">
          <p className="kicker">{copy.kicker}</p>
          <h1>{copy.title}</h1>
          <p>{copy.description}</p>
        </header>

        <section className="card gift-result-card" aria-live="polite">
          <h2>{copy.pickedTitle}</h2>
          <p className="gift-picked-value">{pickedGift?.name || copy.pickedEmpty}</p>
          {pickedGift?.tags?.length ? (
            <div className="gift-tag-list">
              {pickedGift.tags.map((tag) => (
                <span key={`result-${pickedGift.name}-${tag}`} className={`gift-tag tag-${tag}`}>
                  {getTagLabel(tag)}
                </span>
              ))}
            </div>
          ) : null}
          <div className="actions single">
            <button
              type="button"
              className="button primary"
              onClick={onPickGift}
              disabled={!filteredGifts.length || isPicking}
            >
              {isPicking ? copy.picking : copy.pick}
            </button>
          </div>
          <p className="gift-picker-helper">{copy.helper}</p>
        </section>

        <section className="card gift-add-card">
          <div className="gift-add-head">
            <button
              type="button"
              className="button ghost"
              onClick={() => setIsAddBoxOpen((prev) => !prev)}
              aria-expanded={isAddBoxOpen}
            >
              {isAddBoxOpen ? copy.addBoxClose : copy.addBoxOpen}
            </button>
          </div>

          {isAddBoxOpen ? (
            <>
              <form className="gift-input-row" onSubmit={onAddGift}>
                <input
                  type="text"
                  value={inputValue}
                  disabled={isPicking}
                  onChange={(event) => {
                    setInputValue(event.target.value);
                    if (errorText) {
                      setErrorText('');
                    }
                  }}
                  placeholder={copy.inputPlaceholder}
                  aria-label={copy.inputPlaceholder}
                />
                <button type="submit" className="button ghost" disabled={isPicking}>
                  {copy.add}
                </button>
              </form>

              {errorText ? <p className="converter-error">{errorText}</p> : null}
            </>
          ) : null}
        </section>

        <section className="card gift-picker-card">
          <div className="list-head">
            <div className="list-head-main">
              <h2>{copy.listTitle}</h2>
              <p>{copy.listCount(gifts.length)}</p>
            </div>
          </div>

          <div className="gift-filter-wrap">
            <p>{copy.filterTitle}</p>
            <div className="gift-filter-list">
              <label className="gift-filter-item gift-filter-all">
                <input
                  type="checkbox"
                  checked={allTagsSelected}
                  onChange={onToggleAllTags}
                  disabled={isPicking}
                />
                <span>{copy.selectAllTags}</span>
              </label>
              {TAG_ORDER.map((tag) => (
                <label key={`filter-${tag}`} className="gift-filter-item">
                  <input
                    type="checkbox"
                    checked={Boolean(selectedTags[tag])}
                    onChange={() => onToggleTag(tag)}
                    disabled={isPicking}
                  />
                  <span className={`gift-tag tag-${tag}`}>{getTagLabel(tag)}</span>
                </label>
              ))}
            </div>
            <p className="gift-picker-helper">{copy.poolCount(filteredGifts.length)}</p>
          </div>

          {gifts.length ? (
            <ul className="gift-list">
              {gifts.map((gift, index) => (
                <li key={`${gift.name}-${index}`} className="gift-item">
                  <div className="gift-item-main">
                    <strong>{gift.name}</strong>
                    <div className="gift-tag-list">
                      {gift.tags.map((tag) => (
                        <span key={`${gift.name}-${tag}`} className={`gift-tag tag-${tag}`}>
                          {getTagLabel(tag)}
                        </span>
                      ))}
                    </div>
                  </div>
                  <button
                    type="button"
                    className="button ghost delete-btn"
                    onClick={() => onDeleteGift(index)}
                    disabled={isPicking}
                  >
                    {copy.remove}
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p>{copy.empty}</p>
          )}

          {!filteredGifts.length ? <p className="converter-error">{copy.emptyPool}</p> : null}
        </section>
      </div>
    </section>
  );
}

export default BirthdayGiftPickerPage;
