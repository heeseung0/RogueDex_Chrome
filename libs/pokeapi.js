class PokeApi {
    static async getTypeEffectiveness(type) {
        try {
            const response = await fetch(`https://pokeapi.co/api/v2/type/${type}`);
            const data = await response.json();
            return data.damage_relations;
        } catch (error) {
            console.error(`Error fetching type effectiveness for ${type}:`, error);
            return null;
        }
    }
        static async getAbility(pokemonId, abilityIndex) {
			const abilityTranslations = {
				"stench": { "name": "악취", "description": "악취를 풍겨서 공격했을 때 상대가 풀죽을 때가 있다." },
				"drizzle": { "name": "잔비", "description": "등장했을 때 날씨를 비로 만든다." },
				"speed-boost": { "name": "가속", "description": "매 턴 스피드가 올라간다." },
				"battle-armor": { "name": "전투무장", "description": "단단한 껍질에 보호받아 상대의 공격이 급소에 맞지 않는다." },
				"sturdy": { "name": "옹골참", "description": "상대 기술을 받아도 일격으로 쓰러지지 않는다. 일격필살 기술도 효과 없다." },
				"damp": { "name": "습기", "description": "주변을 습하게 함으로써 자폭 등 폭발하는 기술을 아무도 못 쓰게 한다." },
				"limber": { "name": "유연", "description": "유연한 몸으로 인해 마비 상태가 되지 않는다." },
				"sand-veil": { "name": "모래숨기", "description": "모래바람일 때 회피율이 올라간다." },
				"static": { "name": "정전기", "description": "정전기를 몸에 둘러 접촉한 상대를 마비시킬 때가 있다." },
				"volt-absorb": { "name": "축전 ", "description": "전기타입의 기술을 받으면 데미지를 받지 않고 회복한다." },
				"water-absorb": { "name": "저수 ", "description": "물타입의 기술을 받으면 데미지를 받지 않고 회복한다." },
				"oblivious": { "name": "둔감", "description": "둔감해서 헤롱헤롱이나 도발 상태가 되지 않는다." },
				"cloud-nine": { "name": "날씨부정", "description": "모든 날씨의 영향이 없어진다." },
				"compound-eyes": { "name": "복안", "description": "복안을 가지고 있어 기술의 명중률이 올라간다." },
				"insomnia": { "name": "불면", "description": "잠들지 못하는 체질이라 잠듦 상태가 되지 않는다." },
				"color-change": { "name": "변색", "description": "상대에게 받은 기술의 타입으로 자신의 타입이 변화한다." },
				"immunity": { "name": "면역", "description": "체내에 면역을 가지고 있어 독 상태가 되지 않는다." },
				"flash-fire": { "name": "타오르는불꽃", "description": "불꽃타입의 기술을 받으면 불꽃을 받아서 자신이 사용하는 불꽃타입의 기술이 강해진다." },
				"shield-dust": { "name": "인분 ", "description": "인분에 보호받아 기술의 추가 효과를 받지 않게 된다." },
				"own-tempo": { "name": "마이페이스", "description": "마이페이스라서 혼란 상태가 되지 않는다." },
				"suction-cups": { "name": "흡반", "description": "흡반으로 지면에 달라붙어 포켓몬을 교체시키는 기술이나 도구의 효과를 발휘하지 못하게 한다." },
				"intimidate": { "name": "위협", "description": "등장했을 때 위협해서 상대를 위축시켜 상대의 공격을 떨어뜨린다." },
				"shadow-tag": { "name": "그림자밟기", "description": "상대의 그림자를 밟아 도망치거나 교체할 수 없게 한다." },
				"rough-skin": { "name": "까칠한피부", "description": "공격을 받았을 때 자신에게 접촉한 상대를 까칠까칠한 피부로 상처를 입힌다." },
				"wonder-guard": { "name": "불가사의부적", "description": "효과가 굉장한 기술만 맞는 불가사의한 힘." },
				"levitate": { "name": "부유", "description": "땅에서 뜨는 것으로 땅타입의 기술을 받지 않는다." },
				"effect-spore": { "name": "포자", "description": "공격으로 자신에게 접촉한 상대를 독이나 마비, 잠듦 상태로 만들 때가 있다." },
				"synchronize": { "name": "싱크로 ", "description": "자신이 걸린 독이나 마비, 화상을 상대에게 옮긴다." },
				"clear-body": { "name": "클리어바디", "description": "상대 기술이나 특성으로 능력이 떨어지지 않는다." },
				"natural-cure": { "name": "자연회복", "description": "지닌 포켓몬으로 돌아오면 상태 이상이 회복된다." },
				"lightning-rod": { "name": "피뢰침", "description": "전기타입의 기술을 자신에게 끌어모아 데미지를 받지 않고 특수공격을 올린다." },
				"serene-grace": { "name": "하늘의은총 ", "description": "하늘의 은총 덕분에 기술의 추가 효과가 나오기 쉽다." },
				"swift-swim": { "name": "쓱쓱", "description": "비가 오는 날씨일 때 스피드가 올라간다." },
				"chlorophyll": { "name": "엽록소", "description": "날씨가 맑을 때 스피드가 올라간다." },
				"illuminate": { "name": "발광", "description": "주변을 밝게 하여 명중률이 떨어지지 않는다." },
				"trace": { "name": "트레이스", "description": "등장했을 때 상대의 특성을 트레이스해서 같은 특성이 된다." },
				"huge-power": { "name": "천하장사", "description": "물리공격의 위력이 2배가 된다." },
				"poison-point": { "name": "독가시", "description": "자신과 접촉한 상대를 독 상태로 만들 때가 있다." },
				"inner-focus": { "name": "정신력", "description": "단련한 정신으로 인하여 상대의 공격에 풀죽지 않는다." },
				"magma-armor": { "name": "마그마의무장", "description": "뜨거운 마그마를 몸에 둘러서 얼음 상태가 되지 않는다." },
				"water-veil": { "name": "수의베일", "description": "물의 베일을 몸에 둘러서 화상 상태가 되지 않는다." },
				"magnet-pull": { "name": "자력", "description": "강철타입의 포켓몬을 자력으로 끌어모아 도망칠 수 없게 한다." },
				"soundproof": { "name": "방음", "description": "소리를 차단하는 것으로 소리 공격을 받지 않는다." },
				"rain-dish": { "name": "젖은접시 ", "description": "비가 오는 날씨일 때 조금씩 HP를 회복한다." },
				"sand-stream": { "name": "모래날림", "description": "등장했을 때 날씨를 모래바람으로 만든다." },
				"pressure": { "name": "프레셔", "description": "프레셔를 줘서 상대가 쓰는 기술의 PP를 많이 줄인다." },
				"thick-fat": { "name": "두꺼운지방", "description": "두꺼운 지방으로 보호되고 있어 불꽃타입과 얼음타입의 기술의 데미지를 반감시킨다." },
				"early-bird": { "name": "일찍기상", "description": "잠듦 상태가 되어도 2배 스피드로 깨어날 수 있다." },
				"flame-body": { "name": "불꽃몸", "description": "자신과 접촉한 상대를 화상 상태로 만들 때가 있다." },
				"run-away": { "name": "도주", "description": "야생 포켓몬으로부터 반드시 도망칠 수 있다." },
				"keen-eye": { "name": "날카로운눈", "description": "날카로운 눈 덕분에 명중률이 떨어지지 않는다." },
				"hyper-cutter": { "name": "괴력집게", "description": "힘이 자랑인 집게를 가지고 있어 상대가 공격을 떨어뜨리지 못한다." },
				"pickup": { "name": "픽업", "description": "상대가 지닌 도구를 주워올 때가 있다." },
				"truant": { "name": "게으름", "description": "기술을 사용하면 다음 턴은 쉰다." },
				"hustle": { "name": "의욕", "description": "자신의 공격이 높아지지만 명중률이 떨어진다." },
				"cute-charm": { "name": "헤롱헤롱바디", "description": "자신과 접촉한 상대를 헤롱헤롱 상태로 만들 때가 있다." },
				"plus": { "name": "플러스", "description": "플러스나 마이너스의 특성을 가진 포켓몬이 동료에 있으면 자신의 특수공격이 올라간다." },
				"minus": { "name": "마이너스", "description": "플러스나 마이너스의 특성을 가진 포켓몬이 동료에 있으면 자신의 특수공격이 올라간다." },
				"forecast": { "name": "기분파 ", "description": "날씨의 영향을 받아 물타입, 불꽃타입, 얼음타입 중 하나로 변화한다." },
				"sticky-hold": { "name": "점착", "description": "점착질의 몸에 도구가 달라붙어 있어 상대에게 도구를 뺏기지 않는다." },
				"shed-skin": { "name": "탈피", "description": "몸의 껍질을 벗어 던져 상태 이상을 회복할 때가 있다." },
				"guts": { "name": "근성", "description": "상태 이상이 되면 근성을 보여서 공격이 올라간다." },
				"marvel-scale": { "name": "이상한비늘", "description": "상태 이상이 되면 이상한 비늘이 반응해서 방어가 올라간다." },
				"liquid-ooze": { "name": "해감액", "description": "해감액을 흡수한 상대는 강렬한 악취로 데미지를 받아 HP가 줄어든다." },
				"overgrow": { "name": "심록", "description": "HP가 줄었을 때 풀타입 기술의 위력이 올라간다." },
				"blaze": { "name": "맹화", "description": "HP가 줄었을 때 불꽃타입 기술의 위력이 올라간다." },
				"torrent": { "name": "급류", "description": "HP가 줄었을 때 물타입 기술의 위력이 올라간다." },
				"swarm": { "name": "벌레의알림", "description": "HP가 줄었을 때 벌레타입 기술의 위력이 올라간다." },
				"rock-head": { "name": "돌머리", "description": "반동을 받는 기술을 사용해도 HP가 줄지 않는다." },
				"drought": { "name": "가뭄", "description": "등장했을 때 날씨를 맑음으로 만든다." },
				"arena-trap": { "name": "개미지옥", "description": "배틀에서 상대를 도망칠 수 없게 한다." },
				"vital-spirit": { "name": "의기양양", "description": "의기양양해져서 잠듦 상태가 되지 않는다." },
				"white-smoke": { "name": "하얀연기", "description": "하얀 연기의 보호를 받아 상대가 능력을 떨어뜨릴 수 없다." },
				"pure-power": { "name": "순수한힘", "description": "요가의 힘으로 물리공격의 위력이 2배가 된다." },
				"shell-armor": { "name": "조가비갑옷", "description": "단단한 껍질의 보호를 받아 상대의 공격이 급소에 맞지 않는다." },
				"air-lock": { "name": "에어록", "description": "모든 날씨의 영향이 없어진다." },
				"tangled-feet": { "name": "갈지자걸음", "description": "혼란 상태일 때는 회피율이 올라간다." },
				"motor-drive": { "name": "전기엔진", "description": "전기타입의 기술을 받으면 데미지를 받지 않고 스피드가 올라간다." },
				"rivalry": { "name": "투쟁심", "description": "성별이 같으면 투쟁심을 불태워 강해진다. 성별이 다르면 약해진다." },
				"steadfast": { "name": "불굴의마음", "description": "풀죽을 때마다 불굴의 마음을 불태워 스피드가 올라간다." },
				"snow-cloak": { "name": "눈숨기", "description": "날씨가 눈일 때 회피율이 올라간다." },
				"gluttony": { "name": "먹보", "description": "HP가 줄어들면 먹을 나무열매를 HP가 절반일 때 먹어버린다." },
				"anger-point": { "name": "분노의경혈", "description": "급소에 공격이 맞으면 크게 분노해 공격력이 최대가 된다." },
				"unburden": { "name": "곡예 ", "description": "지니던 도구가 없어지면 스피드가 올라간다." },
				"heatproof": { "name": "내열", "description": "내열인 몸으로 인해 불꽃타입 공격의 데미지를 반감한다." },
				"simple": { "name": "단순", "description": "능력 변화가 평소의 2배가 된다." },
				"dry-skin": { "name": "건조피부 ", "description": "비가 오는 날씨나 물타입의 기술로 HP가 회복되고 맑을 때나 불꽃타입의 기술로는 줄어든다." },
				"download": { "name": "다운로드", "description": "상대의 방어와 특수방어를 비교해서 낮은 쪽 능력에 맞춰서 자신의 공격이나 특수공격을 올린다." },
				"iron-fist": { "name": "철주먹", "description": "펀치를 사용하는 기술의 위력이 올라간다." },
				"poison-heal": { "name": "포이즌힐", "description": "독 상태가 되면 HP가 줄지 않고 증가한다." },
				"adaptability": { "name": "적응력", "description": "자신과 같은 타입의 기술 위력이 올라간다." },
				"skill-link": { "name": "스킬링크", "description": "연속 기술을 사용하면 항상 최고 횟수를 사용할 수 있다." },
				"hydration": { "name": "촉촉바디", "description": "비가 오는 날씨일 때 상태 이상이 회복된다." },
				"solar-power": { "name": "선파워", "description": "날씨가 맑으면 특수공격이 올라가지만 매 턴 HP가 줄어든다." },
				"quick-feet": { "name": "속보", "description": "상태 이상이 되면 스피드가 올라간다." },
				"normalize": { "name": "노말스킨", "description": "어떤 타입의 기술도 모두 노말타입이 된다. 위력이 조금 올라간다." },
				"sniper": { "name": "스나이퍼", "description": "공격을 급소에 맞혔을 때 위력이 더욱 올라간다." },
				"magic-guard": { "name": "매직가드", "description": "공격 이외에는 데미지를 입지 않는다." },
				"no-guard": { "name": "노가드", "description": "노가드전법에 따라 서로가 사용하는 기술이 반드시 맞게 된다." },
				"stall": { "name": "시간벌기 ", "description": "기술을 사용하는 순서가 반드시 마지막이 된다." },
				"technician": { "name": "테크니션", "description": "위력이 약한 기술의 위력을 올려서 공격할 수 있다." },
				"leaf-guard": { "name": "리프가드", "description": "날씨가 맑을 때는 상태 이상이 되지 않는다." },
				"klutz": { "name": "서투름 ", "description": "지니고 있는 도구를 쓸 수 없다." },
				"mold-breaker": { "name": "틀깨기", "description": "상대 특성에 방해받지 않고 상대에게 기술을 쓸 수 있다." },
				"super-luck": { "name": "대운 ", "description": "대운을 가지고 있어 상대의 급소에 공격이 맞기 쉽다." },
				"aftermath": { "name": "유폭", "description": "기절했을 때 접촉한 상대에게 데미지를 준다." },
				"anticipation": { "name": "위험예지", "description": "상대가 지닌 위험한 기술을 감지할 수 있다." },
				"forewarn": { "name": "예지몽", "description": "등장했을 때 상대가 지닌 기술을 하나만 꿰뚫어본다." },
				"unaware": { "name": "천진", "description": "상대의 능력 변화를 무시하고 공격할 수 있다." },
				"tinted-lens": { "name": "색안경", "description": "효과가 별로인 기술을 통상의 위력으로 쓸 수 있다." },
				"filter": { "name": "필터", "description": "효과가 굉장한 공격의 위력을 약하게 만든다." },
				"slow-start": { "name": "슬로스타트", "description": "5턴 동안 공격과 스피드가 절반이 된다." },
				"scrappy": { "name": "배짱", "description": "고스트타입 포켓몬에게 노말타입과 격투타입의 기술을 맞게 한다." },
				"storm-drain": { "name": "마중물", "description": "물타입의 기술을 자신에게 끌어모아 데미지는 받지 않고 특수공격이 올라간다." },
				"ice-body": { "name": "아이스바디 ", "description": "날씨가 눈일 때 HP를 조금씩 회복한다." },
				"solid-rock": { "name": "하드록", "description": "효과가 굉장한 공격의 위력을 약하게 만든다." },
				"snow-warning": { "name": "눈퍼뜨리기", "description": "등장했을 때 날씨를 눈으로 만든다." },
				"honey-gather": { "name": "꿀모으기", "description": "배틀이 끝났을 때 달콤한꿀을 주울 때가 있다. 배틀 후에 꿀을 팔아 돈을 받을 수 있다." },
				"frisk": { "name": "통찰", "description": "등장했을 때 상대의 특성을 통찰할 수 있다." },
				"reckless": { "name": "이판사판", "description": "반동 데미지를 받는 기술의 위력이 올라간다." },
				"multitype": { "name": "멀티타입", "description": "지니고 있는 플레이트나 Z크리스탈 타입에 따라 자신의 타입이 바뀐다." },
				"flower-gift": { "name": "플라워기프트 ", "description": "날씨가 맑을 때 자신과 같은 편의 공격과 특수방어의 능력이 올라간다." },
				"bad-dreams": { "name": "나이트메어", "description": "잠듦 상태의 상대에게 데미지를 준다." },
				"pickpocket": { "name": "나쁜손버릇", "description": "접촉한 상대의 도구를 훔친다." },
				"sheer-force": { "name": "우격다짐 ", "description": "기술의 추가 효과가 없어지지만 그만큼 높은 위력으로 기술을 사용할 수 있다." },
				"contrary": { "name": "심술꾸러기", "description": "능력의 변화가 역전해서 올라갈 때 떨어지고 떨어질 때 올라간다." },
				"unnerve": { "name": "긴장감", "description": "상대를 긴장시켜 나무열매를 먹지 못하게 한다." },
				"defiant": { "name": "오기", "description": "능력이 떨어지면 공격이 크게 올라간다." },
				"defeatist": { "name": "무기력", "description": "HP가 절반이 되면 무기력해져서 공격과 특수공격이 반감된다." },
				"cursed-body": { "name": "저주받은바디", "description": "공격을 받으면 상대의 기술을 사슬묶기 상태로 만들 때가 있다." },
				"healer": { "name": "치유의마음", "description": "같은 편의 상태 이상을 가끔 회복시킨다." },
				"friend-guard": { "name": "프렌드가드 ", "description": "같은 편의 데미지를 줄일 수 있다." },
				"weak-armor": { "name": "깨어진갑옷", "description": "물리 기술로 데미지를 받으면 방어가 떨어지고 스피드가 크게 올라간다." },
				"heavy-metal": { "name": "헤비메탈", "description": "자신의 무게가 2배가 된다." },
				"light-metal": { "name": "라이트메탈", "description": "자신의 무게가 절반이 된다." },
				"multiscale": { "name": "멀티스케일", "description": "HP가 꽉 찼을 때 받는 데미지가 줄어든다." },
				"toxic-boost": { "name": "독폭주", "description": "독 상태가 되었을 때 물리 기술의 위력이 올라간다." },
				"flare-boost": { "name": "열폭주", "description": "화상 상태가 되었을 때 특수 기술의 위력이 올라간다." },
				"harvest": { "name": "수확 ", "description": "사용한 나무열매를 몇 번이고 만들어 낸다." },
				"telepathy": { "name": "텔레파시", "description": "같은 편의 공격의 낌새를 읽고 기술을 회피한다." },
				"moody": { "name": "변덕쟁이", "description": "매 턴 능력 중 하나가 크게 오르고 하나가 떨어진다." },
				"overcoat": { "name": "방진", "description": "모래바람이나 싸라기눈 등의 데미지를 입지 않는다. 가루의 기술을 받지 않는다." },
				"poison-touch": { "name": "독수", "description": "접촉하기만 해도 상대를 독 상태로 만들 때가 있다." },
				"regenerator": { "name": "재생력", "description": "지닌 포켓몬으로 돌아오면 HP를 조금 회복한다." },
				"big-pecks": { "name": "부풀린가슴", "description": "방어를 떨어뜨리는 효과를 받지 않는다." },
				"sand-rush": { "name": "모래헤치기", "description": "날씨가 모래바람일 때 스피드가 올라간다." },
				"wonder-skin": { "name": "미라클스킨", "description": "변화 기술을 받기 어려운 몸으로 되어 있다." },
				"analytic": { "name": "애널라이즈", "description": "제일 마지막에 기술을 쓰면 기술의 위력이 올라간다." },
				"illusion": { "name": "일루전 ", "description": "지닌 포켓몬 중 제일 뒤에 있는 포켓몬으로 둔갑하여 나와서 상대를 속인다." },
				"imposter": { "name": "괴짜", "description": "눈앞의 포켓몬으로 변신해버린다." },
				"infiltrator": { "name": "틈새포착 ", "description": "상대의 벽이나 대타출동을 뚫고 공격할 수 있다." },
				"mummy": { "name": "미라", "description": "상대가 접촉하면 상대를 미라로 만들어버린다." },
				"moxie": { "name": "자기과신", "description": "상대를 쓰러뜨리면 자신감이 붙어서 공격이 올라간다." },
				"justified": { "name": "정의의마음", "description": "악타입 공격을 받으면 정의감으로 공격이 올라간다." },
				"rattled": { "name": "주눅", "description": "위협이나 악타입과 고스트타입과 벌레타입의 기술에 주눅이 들어 스피드가 올라간다." },
				"magic-bounce": { "name": "매직미러 ", "description": "상대가 쓴 변화 기술을 받지 않고 그대로 되받아칠 수 있다." },
				"sap-sipper": { "name": "초식", "description": "풀타입 기술을 받으면 데미지를 입지 않고 공격이 올라간다." },
				"prankster": { "name": "짓궂은마음", "description": "변화 기술을 먼저 쓸 수 있다." },
				"sand-force": { "name": "모래의힘", "description": "날씨가 모래바람일 때 바위타입과 땅타입과 강철타입의 위력이 올라간다." },
				"iron-barbs": { "name": "철가시", "description": "자신과 접촉한 상대에게 철가시로 데미지를 준다." },
				"zen-mode": { "name": "달마모드", "description": "HP가 절반 이하가 되면 모습이 변화한다." },
				"victory-star": { "name": "승리의별 ", "description": "자신과 같은 편의 명중률이 올라간다." },
				"turboblaze": { "name": "터보블레이즈", "description": "상대 특성에 방해받지 않고 상대에게 기술을 쓸 수 있다." },
				"teravolt": { "name": "테라볼티지", "description": "상대 특성에 방해받지 않고 상대에게 기술을 쓸 수 있다." },
				"aroma-veil": { "name": "아로마베일 ", "description": "자신과 같은 편으로 향하는 멘탈 공격을 막을 수 있다." },
				"flower-veil": { "name": "플라워베일 ", "description": "같은 편의 풀타입 포켓몬은 능력이 떨어지지 않고 상태 이상도 되지 않는다." },
				"cheek-pouch": { "name": "볼주머니 ", "description": "어떤 나무열매라도 먹으면 HP도 회복한다." },
				"protean": { "name": "변환자재", "description": "자신이 사용한 기술과 같은 타입으로 변화한다." },
				"fur-coat": { "name": "퍼코트", "description": "상대로부터 받는 물리 기술의 데미지가 절반이 된다." },
				"magician": { "name": "매지션", "description": "기술을 맞은 상대의 도구를 빼앗아 버린다." },
				"bulletproof": { "name": "방탄", "description": "상대 구슬이나 폭탄 등 기술을 막을 수 있다." },
				"competitive": { "name": "승기", "description": "능력이 떨어지면 특수공격이 크게 올라간다." },
				"strong-jaw": { "name": "옹골찬턱", "description": "턱이 튼튼하여 무는 기술의 위력이 올라간다." },
				"refrigerate": { "name": "프리즈스킨", "description": "노말타입의 기술이 얼음타입이 된다. 위력이 조금 올라간다." },
				"sweet-veil": { "name": "스위트베일 ", "description": "같은 편의 포켓몬이 잠들지 않게 된다." },
				"stance-change": { "name": "배틀스위치", "description": "공격 기술을 쓰면 블레이드폼으로 기술 킹실드를 쓰면 실드폼으로 변한다." },
				"gale-wings": { "name": "질풍날개", "description": "HP가 꽉 찼을 때 비행타입의 기술을 먼저 쓸 수 있다." },
				"mega-launcher": { "name": "메가런처", "description": "파동 기술의 위력이 올라간다." },
				"grass-pelt": { "name": "풀모피", "description": "그래스필드일 때 방어가 올라간다." },
				"symbiosis": { "name": "공생 ", "description": "같은 편이 도구를 쓰면 자신이 지니고 있는 도구를 같은 편에게 건넨다." },
				"tough-claws": { "name": "단단한발톱", "description": "상대에게 접촉하는 기술의 위력이 올라간다." },
				"pixilate": { "name": "페어리스킨", "description": "노말타입의 기술이 페어리타입이 된다. 위력이 조금 올라간다." },
				"gooey": { "name": "미끈미끈", "description": "공격으로 자신과 접촉한 상대의 스피드를 떨어뜨린다." },
				"aerilate": { "name": "스카이스킨", "description": "노말타입의 기술이 비행타입이 된다. 위력이 조금 올라간다." },
				"parental-bond": { "name": "부자유친 ", "description": "부모와 자식 2마리로 2번 공격할 수 있다." },
				"dark-aura": { "name": "다크오라", "description": "전원의 악타입 기술이 강해진다." },
				"fairy-aura": { "name": "페어리오라", "description": "전원의 페어리타입 기술이 강해진다." },
				"aura-break": { "name": "오라브레이크", "description": "오라의 효과를 역전시켜 위력을 떨어뜨린다." },
				"primordial-sea": { "name": "시작의바다", "description": "불꽃타입의 공격을 받지 않는 날씨로 만든다." },
				"desolate-land": { "name": "끝의대지", "description": "물타입의 공격을 받지 않는 날씨로 만든다." },
				"delta-stream": { "name": "델타스트림", "description": "비행타입의 약점이 없어지는 날씨로 만든다." },
				"stamina": { "name": "지구력", "description": "공격을 받으면 방어가 올라간다." },
				"wimp-out": { "name": "도망태세 ", "description": "HP가 절반이 되면 황급히 도망쳐서 지닌 포켓몬으로 돌아간다." },
				"emergency-exit": { "name": "위기회피 ", "description": "HP가 절반이 되면 위험을 회피하기 위해 지닌 포켓몬으로 돌아간다." },
				"water-compaction": { "name": "꾸덕꾸덕굳기", "description": "물타입의 기술을 받으면 방어가 크게 올라간다." },
				"merciless": { "name": "무도한행동", "description": "독 상태의 상대를 공격하면 반드시 급소에 맞는다." },
				"shields-down": { "name": "리밋실드 ", "description": "HP가 절반이 되면 껍질이 깨져 공격적으로 된다." },
				"stakeout": { "name": "잠복", "description": "교체로 나온 상대에게 2배 데미지로 공격할 수 있다." },
				"water-bubble": { "name": "수포", "description": "자신을 향하는 불꽃타입 기술의 위력을 떨어뜨린다. 화상을 입지 않는다." },
				"steelworker": { "name": "강철술사", "description": "강철타입 기술의 위력이 올라간다." },
				"berserk": { "name": "발끈", "description": "상대의 공격으로 HP가 절반이 되면 특수공격이 올라간다." },
				"slush-rush": { "name": "눈치우기", "description": "날씨가 눈일 때 스피드가 올라간다." },
				"long-reach": { "name": "원격", "description": "모든 기술을 상대에게 접촉하지 않고 사용할 수 있다." },
				"liquid-voice": { "name": "촉촉보이스", "description": "모든 소리 기술이 물타입이 된다." },
				"triage": { "name": "힐링시프트", "description": "회복 기술을 먼저 사용할 수 있다." },
				"galvanize": { "name": "일렉트릭스킨", "description": "노말타입 기술이 전기타입이 된다. 위력이 조금 올라간다." },
				"surge-surfer": { "name": "서핑테일", "description": "일렉트릭필드일 때 스피드가 2배가 된다." },
				"schooling": { "name": "어군", "description": "HP가 많을 때 무리지어 강해진다. HP가 얼마 남지 않으면 무리는 뿔뿔이 흩어진다." },
				"disguise": { "name": "탈 ", "description": "몸을 덮는 탈로 1번 공격을 막을 수 있다." },
				"battle-bond": { "name": "유대변화", "description": "상대를 쓰러뜨리면 트레이너와의 유대감이 깊어져서 지우개굴닌자로 변한다. 물수리검이 강해진다." },
				"power-construct": { "name": "스웜체인지 ", "description": "HP가 절반이 되면 셀들이 응원하러 달려와 퍼펙트폼으로 모습이 변한다." },
				"corrosion": { "name": "부식 ", "description": "강철타입이나 독타입도 독 상태로 만들 수 있다." },
				"comatose": { "name": "절대안깸", "description": "항상 비몽사몽 상태로 절대 깨지 않는다. 잠든 상태로 공격할 수 있다." },
				"queenly-majesty": { "name": "여왕의위엄", "description": "상대에게 위압감을 줘서 이쪽을 향한 선제 기술을 사용할 수 없게 한다." },
				"innards-out": { "name": "내용물분출", "description": "상대가 쓰러뜨렸을 때 HP의 남은 양만큼 상대에게 데미지를 준다." },
				"dancer": { "name": "무희", "description": "누군가 춤 기술을 쓰면 자신도 이어서 춤 기술을 쓸 수 있다." },
				"battery": { "name": "배터리", "description": "같은 편 특수 기술의 위력을 올린다." },
				"fluffy": { "name": "복슬복슬", "description": "상대로부터 받은 접촉하는 기술의 데미지를 반감시키지만 불꽃타입 기술의 데미지는 2배가 된다." },
				"dazzling": { "name": "비비드바디", "description": "상대를 놀라게 해서 이쪽을 향한 선제 기술을 사용할 수 없게 한다." },
				"soul-heart": { "name": "소울하트", "description": "포켓몬이 기절할 때마다 특수공격이 올라간다." },
				"tangling-hair": { "name": "컬리헤어", "description": "공격으로 자신에게 접촉한 상대의 스피드를 떨어뜨린다." },
				"receiver": { "name": "리시버", "description": "쓰러진 같은 편의 특성을 이어받아 같은 특성으로 바뀐다." },
				"power-of-alchemy": { "name": "화학의힘", "description": "쓰러진 같은 편의 특성을 이어받아 같은 특성으로 바뀐다." },
				"beast-boost": { "name": "비스트부스트", "description": "상대를 기절시켰을 때 자신의 가장 높은 능력이 올라간다." },
				"rks-system": { "name": "AR시스템", "description": "지니고 있는 메모리로 자신의 타입이 변한다." },
				"electric-surge": { "name": "일렉트릭메이커", "description": "등장했을 때 일렉트릭필드를 사용한다." },
				"psychic-surge": { "name": "사이코메이커", "description": "등장했을 때 사이코필드를 사용한다." },
				"misty-surge": { "name": "미스트메이커", "description": "등장했을 때 미스트필드를 사용한다." },
				"grassy-surge": { "name": "그래스메이커", "description": "등장했을 때 그래스필드를 사용한다." },
				"full-metal-body": { "name": "메탈프로텍트", "description": "상대 기술이나 특성으로 능력이 떨어지지 않는다." },
				"shadow-shield": { "name": "스펙터가드", "description": "HP가 꽉 찼을 때 받는 데미지가 줄어든다." },
				"prism-armor": { "name": "프리즘아머", "description": "효과가 굉장한 공격의 위력을 약하게 만든다." },
				"neuroforce": { "name": "브레인포스", "description": "효과가 굉장한 공격의 위력이 더욱 올라간다." },
				"intrepid-sword": { "name": "불요의검", "description": "등장했을 때 공격이 올라간다." },
				"dauntless-shield": { "name": "불굴의방패", "description": "등장했을 때 방어가 올라간다." },
				"libero": { "name": "리베로", "description": "자신이 사용한 기술과 같은 타입으로 변화한다." },
				"ball-fetch": { "name": "볼줍기", "description": "첫 번째로 실패한 몬스터볼을 주워온다." },
				"cotton-down": { "name": "솜털", "description": "공격을 받으면 솜털을 흩뿌려서 자신을 제외한 모든 포켓몬의 스피드를 떨어뜨린다." },
				"propeller-tail": { "name": "스크루지느러미", "description": "상대의 기술을 끌어모으는 특성이나 기술의 영향을 받지 않는다." },
				"mirror-armor": { "name": "미러아머 ", "description": "자신이 받는 능력 다운 효과에 한해 되받아친다." },
				"gulp-missile": { "name": "그대로꿀꺽미사일 ", "description": "파도타기나 다이빙을 쓰면 먹이를 물어온다. 데미지를 받으면 먹이를 토해내서 공격한다." },
				"stalwart": { "name": "굳건한신념", "description": "상대의 기술을 끌어모으는 특성이나 기술의 영향을 받지 않는다." },
				"steam-engine": { "name": "증기기관", "description": "물타입이나 불꽃타입 기술을 받으면 스피드가 매우 크게 올라간다." },
				"punk-rock": { "name": "펑크록", "description": "소리 기술의 위력이 올라간다. 상대로부터 받는 소리 기술의 데미지는 절반이 된다." },
				"sand-spit": { "name": "모래뿜기", "description": "공격을 받으면 모래바람을 일으킨다." },
				"ice-scales": { "name": "얼음인분", "description": "얼음인분의 보호를 받아 특수공격으로 받는 데미지가 절반이 된다." },
				"ripen": { "name": "숙성", "description": "나무열매를 숙성시켜서 효과가 2배가 된다." },
				"ice-face": { "name": "아이스페이스", "description": "물리공격을 머리의 얼음이 대신 맞아주지만 모습도 바뀐다. 얼음은 싸라기눈이 내리면 원래대로 돌아온다." },
				"power-spot": { "name": "파워스폿", "description": "옆에 있기만 해도 기술의 위력이 올라간다." },
				"mimicry": { "name": "의태 ", "description": "필드의 상태에 따라 포켓몬의 타입이 바뀐다." },
				"screen-cleaner": { "name": "배리어프리", "description": "등장했을 때 상대와 같은 편의 빛의장막, 리플렉터, 오로라베일의 효과가 사라진다." },
				"steely-spirit": { "name": "강철정신 ", "description": "같은 편의 강철타입 공격의 위력이 올라간다." },
				"perish-body": { "name": "멸망의바디", "description": "접촉하는 기술을 받으면 3턴 후에 양쪽 모두 기절한다. 교체되면 효과가 없어진다." },
				"wandering-spirit": { "name": "떠도는영혼 ", "description": "접촉하는 기술로 공격해온 포켓몬과 특성을 바꾼다." },
				"gorilla-tactics": { "name": "무아지경 ", "description": "공격이 올라가지만 처음에 선택한 기술 외에는 쓸 수 없게 된다." },
				"neutralizing-gas": { "name": "화학변화가스 ", "description": "화학변화가스를 가진 포켓몬이 배틀에 나와 있으면 모든 포켓몬이 가진 특성의 효과가 사라지거나 발동하지 않게 된다." },
				"pastel-veil": { "name": "파스텔베일", "description": "자신과 같은 편이 독의 상태 이상 효과를 받지 않게 된다." },
				"hunger-switch": { "name": "꼬르륵스위치", "description": "턴이 끝날 때마다 배부른 모양, 배고픈 모양, 배부른 모양...으로 번갈아서 모습을 바꾼다." },
				"quick-draw": { "name": "퀵드로 ", "description": "상대보다 먼저 행동할 수도 있다." },
				"unseen-fist": { "name": "보이지않는주먹", "description": "상대에게 접촉하는 기술을 사용하면 방어의 효과를 무시하고 공격할 수 있다." },
				"curious-medicine": { "name": "기묘한약", "description": "등장했을 때 조개껍질에서 약을 흩뿌려서 능력 변화를 원래대로 되돌린다." },
				"transistor": { "name": "트랜지스터", "description": "전기타입 기술의 위력이 올라간다." },
				"dragon's-maw": { "name": "용의턱", "description": "드래곤타입 기술의 위력이 올라간다." },
				"chilling-neigh": { "name": "백의울음", "description": "상대를 쓰러뜨리면 차가운 울음소리를 내면서 공격이 올라간다." },
				"grim-neigh": { "name": "흑의울음", "description": "상대를 쓰러뜨리면 무서운 울음소리를 내면서 특수공격이 올라간다." },
				"as-one-glastrier": { "name": "혼연일체", "description": "버드렉스의 긴장감과 블리자포스의 백의울음 두 가지 특성을 겸비한다." },
				"as-one-spectrier": { "name": "혼연일체", "description": "버드렉스의 긴장감과 레이스포스의 흑의울음 두 가지 특성을 겸비한다." },
				"lingering-aroma": { "name": "가시지않는향기", "description": "상대가 접촉하면 가시지 않는 향기가 상대에게 배어 버린다." },
				"seed-sower": { "name": "넘치는씨", "description": "공격을 받으면 필드를 그래스필드로 만든다." },
				"thermal-exchange": { "name": "열교환", "description": "불꽃타입 기술로 공격받으면 공격이 올라간다. 화상 상태가 되지 않는다." },
				"anger-shell": { "name": "분노의껍질", "description": "상대의 공격에 의해 HP가 절반이 되면 화가 나서 방어와 특수방어가 떨어지지만 공격, 특수공격, 스피드가 올라간다." },
				"purifying-salt": { "name": "정화의소금", "description": "깨끗한 소금에 의해 상태 이상이 되지 않는다. 고스트타입 기술의 데미지를 반감시킨다." },
				"well-baked-body": { "name": "노릇노릇바디", "description": "불꽃타입 기술로 공격받으면 데미지를 입지 않고 방어가 크게 올라간다." },
				"wind-rider": { "name": "바람타기", "description": "순풍이 불거나 바람 기술로 공격받으면 데미지를 받지 않고 공격이 올라간다." },
				"guard-dog": { "name": "파수견", "description": "위협을 받으면 공격이 올라간다. 포켓몬을 교체시키는 기술이나 도구의 효과를 받지 않는다." },
				"rocky-payload": { "name": "바위나르기", "description": "바위타입 기술의 위력이 올라간다." },
				"wind-power": { "name": "풍력발전", "description": "바람 기술로 공격받으면 충전 상태가 된다." },
				"zero-to-hero": { "name": "마이티체인지", "description": "지닌 포켓몬으로 돌아오면 마이티폼으로 변한다." },
				"commander": { "name": "사령탑 ", "description": "등장했을 때 같은 편에 어써러셔가 있으면 입속에 들어가 안에서 지시를 내린다." },
				"electromorphosis": { "name": "전기로바꾸기", "description": "데미지를 받으면 충전 상태가 된다." },
				"protosynthesis": { "name": "고대활성 ", "description": "부스트에너지를 지니고 있거나 날씨가 맑을 때 가장 높은 능력이 올라간다." },
				"quark-drive": { "name": "쿼크차지 ", "description": "부스트에너지를 지니고 있거나 일렉트릭필드일 때 가장 높은 능력이 올라간다." },
				"good-as-gold": { "name": "황금몸 ", "description": "산화하지 않는 튼튼한 황금몸 덕분에 상대의 변화 기술의 영향을 받지 않는다." },
				"vessel-of-ruin": { "name": "재앙의그릇", "description": "재앙을 부르는 그릇의 힘으로 자신을 제외한 모든 포켓몬의 특수 공격을 약하게 만든다." },
				"sword-of-ruin": { "name": "재앙의검", "description": "재앙을 부르는 검의 힘으로 자신을 제외한 모든 포켓몬의 방어를 약하게 만든다." },
				"tablets-of-ruin": { "name": "재앙의목간", "description": "재앙을 부르는 목간의 힘으로 자신을 제외한 모든 포켓몬의 공격을 약하게 만든다." },
				"beads-of-ruin": { "name": "재앙의구슬", "description": "재앙을 부르는 곡옥의 힘으로 자신을 제외한 모든 포켓몬의 특수방어를 약하게 만든다." },
				"orichalcum-pulse": { "name": "진홍빛고동", "description": "등장했을 때 날씨를 맑음으로 만든다. 햇살이 강하면 고대의 고동에 의해 공격이 강화된다." },
				"hadron-engine": { "name": "하드론엔진", "description": "등장했을 때 일렉트릭필드를 전개한다. 일렉트릭필드일 때 미래 기관에 의해 특수공격이 강화된다." },
				"opportunist": { "name": "편승", "description": "상대의 능력이 올라가면 자신도 편승해서 똑같이 자신도 올린다." },
				"cud-chew": { "name": "되새김질 ", "description": "한 번에 한하여 나무열매를 먹으면 다음 턴이 끝날 때 위에서 꺼내서 또 먹는다." },
				"sharpness": { "name": "예리함", "description": "상대를 베는 기술의 위력이 올라간다." },
				"supreme-overlord": { "name": "총대장 ", "description": "등장했을 때 지금까지 쓰러진 같은 편의 수가 많을수록 조금씩 공격과 특수공격이 올라간다." },
				"costar": { "name": "협연", "description": "등장했을 때 같은 편의 능력 변화를 복사한다." },
				"toxic-debris": { "name": "독치장", "description": "물리 기술로 데미지를 받으면 상대의 발밑에 독압정을 뿌린다." },
				"armor-tail": { "name": "테일아머", "description": "머리를 감싸고 있는 수수께끼의 꼬리가 이쪽을 향한 선제 기술을 사용할 수 없게 한다." },
				"earth-eater": { "name": "흙먹기 ", "description": "땅타입의 기술로 공격받으면 데미지를 받지 않고 회복한다." },
				"mycelium-might": { "name": "균사의힘 ", "description": "변화 기술을 사용할 때 반드시 행동이 느려지지만 상대 특성에 방해받지 않는다." },
				"mind's-eye": { "name": "심안", "description": "노말타입과 격투타입 기술을 고스트타입에게 맞힐 수 있다. 상대의 회피율 변화를 무시하고 명중률도 떨어지지 않는다." },
				"supersweet-syrup": { "name": "감미로운꿀", "description": "처음 등장했을 때 감미로운 꿀의 향기를 흩뿌려서 상대의 회피율을 떨어뜨린다." },
				"hospitality": { "name": "대접 ", "description": "등장했을 때 같은 편을 대접해서 HP를 조금 회복시킨다." },
				"toxic-chain": { "name": "독사슬", "description": "독소를 머금은 사슬의 힘으로 기술에 맞은 상대를 맹독 상태로 만들 때가 있다." },
				"embody-aspect-teal": { "name": "초상투영 ", "description": "마음속에 깃든 추억의 힘으로 벽록의가면을 빛나게 하여 자신의 스피드를 올린다." },
				"embody-aspect-wellspring": { "name": "초상투영 ", "description": "마음속에 깃든 추억의 힘으로 우물의가면을 빛나게 하여 자신의 특수방어를 올린다." },
				"embody-aspect-hearthflame": { "name": "초상투영 ", "description": "마음속에 깃든 추억의 힘으로 화덕의가면을 빛나게 하여 자신의 공격력을 올린다." },
				"embody-aspect-cornerstone": { "name": "초상투영 ", "description": "마음속에 깃든 추억의 힘으로 주춧돌의가면을 빛나게 하여 자신의 방어력을 올린다." },
				"tera-shift": { "name": "테라체인지", "description": "등장했을 때 주위의 에너지를 흡수하여 테라스탈폼으로 변한다." },
				"tera-shell": { "name": "테라셸 ", "description": "모든 타입의 힘이 담긴 등껍질이 HP가 꽉 찼을 때 받는 데미지를 모두 효과가 별로이게 만든다." },
				"teraform-zero": { "name": "제로포밍 ", "description": "테라파고스가 스텔라폼이 되었을 때 숨겨진 힘에 의해 날씨와 필드의 영향을 모두 무효로 만든다." },
				"poison-puppeteer": { "name": "독조종", "description": "복숭악동의 기술에 의해 독 상태가 된 상대는 혼란 상태도 되어 버린다." }
				};

        try {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
            const data = await response.json();
            if (abilityIndex >= data.abilities.length) {
                abilityIndex = data.abilities.length - 1;
            }

            const abilityName = data.abilities[abilityIndex].ability.name;
            const ability = abilityTranslations[abilityName];
            const description = ability ? ability.description : "No description found";
            const name = ability ? ability.name : abilityName.toUpperCase().replace('-', ' ');

            return {
                'name': name,
                'description': description,
                'isHidden': data.abilities[abilityIndex].is_hidden
            };
        } catch (error) {
            console.error('Error fetching Pokémon ability:', error);
            return null;
        }
    }

    static async getNature(nature) {
        try {
            const response = await fetch(`https://pokeapi.co/api/v2/nature/${nature}`);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error fetching Nature details:", error);
            return null;
        }
    }

    static async getPokemonType(id) {
        try {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
            const data = await response.json();
            const types = data.types.map(type => type.type.name);
            return types;
        } catch (error) {
            console.error('Error fetching Pokémon type:', error);
            return null;
        }
    }

    static async getBaseStats(id) {
        try {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
            const data = await response.json();
            const baseStats = data.stats.map(stat => stat.base_stat);
            return baseStats;
        } catch (error) {
            console.error('Error fetching Pokémon base stats:', error);
            return null;
        }
    }

    static async getPokemonData(id) {
        try {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
            const data = await response.json();
            const speciesResponse = await fetch(data.species.url);
            const speciesData = await speciesResponse.json();

            return {
                name: data.name,
                speciesUrl: data.species.url,
                captureRate: speciesData.capture_rate
            };
        } catch (error) {
            console.error('Error fetching Pokémon data:', error);
            return null;
        }
    }

    static async getCaptureRate(id) {
        try {
            const pokemonData = await this.getPokemonData(id);
            return pokemonData.captureRate;
        } catch (error) {
            console.error('Error fetching Pokémon capture rate:', error);
            return null;
        }
    }
}