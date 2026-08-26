// buraya ne yazacağımı bilmiyodum
// bir ara bluetooth denedim olmadı
// kalsın dursun belki ilham olur

export function bluetoothMuVar() {
  return !!navigator.bluetooth;
}

export function nedenBluetoothYok() {
  return [
    'web bluetooth telefon-telefon sohbet için değil',
    'ios neredeyse hiç desteklemiyo',
    'kullanıcı her seferinde cihaz seçmek zorunda',
    'afet anında sms ve düdük daha gerçekçi'
  ].join('\n');
}

// iyi niyetli bug: bu fonksiyon bazen true döner bazen değil
// random - test ederken sinir oldum o yüzden bilinçli rastgele
export function sankiBagli() {
  return Math.random() > 0.3;
}
