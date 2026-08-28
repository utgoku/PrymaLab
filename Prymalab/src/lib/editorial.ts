export interface EditorialSource {
  label: string;
  publisher: string;
  url: string;
}

export interface EditorialSection {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
}

export interface KnowledgeArticle {
  slug: string;
  title: string;
  metaTitle: string;
  description: string;
  directAnswer: string;
  category: 'Giấc ngủ' | 'Dinh dưỡng' | 'Nhịp sống';
  publishedAt: string;
  updatedAt: string;
  displayDate: string;
  readTime: string;
  accent: string;
  image: string;
  imageAlt: string;
  highlights: string[];
  sections: EditorialSection[];
  sources: EditorialSource[];
}

export const knowledgeArticles: KnowledgeArticle[] = [
  {
    slug: 'cai-thien-chat-luong-giac-ngu',
    title: 'Cải thiện chất lượng giấc ngủ: bắt đầu từ 4 điểm có thể đo',
    metaTitle: 'Cải thiện giấc ngủ: 4 điểm cần theo dõi',
    description: 'Cách theo dõi và cải thiện giấc ngủ bằng thời lượng, giờ thức dậy, môi trường ngủ và tín hiệu ban ngày, không chạy theo một chỉ số duy nhất.',
    directAnswer: 'Để cải thiện chất lượng giấc ngủ, hãy bảo vệ đủ thời gian ngủ, giữ giờ thức dậy tương đối ổn định, giảm các tín hiệu gây tỉnh táo vào buổi tối và theo dõi cảm giác ban ngày trong ít nhất 7 ngày. Một đêm tốt hay xấu chưa đủ để kết luận xu hướng.',
    category: 'Giấc ngủ',
    publishedAt: '2026-08-19',
    updatedAt: '2026-08-19',
    displayDate: '19/08/2026',
    readTime: '7 phút đọc',
    accent: 'from-[#102f35] via-[#17645f] to-[#78b9aa]',
    image: '/images/sleep_serene.jpg',
    imageAlt: 'Không gian phòng ngủ yên tĩnh với ánh sáng dịu vào buổi tối',
    highlights: [
      'Người trưởng thành khỏe mạnh thường được khuyến nghị ngủ từ 7 giờ mỗi đêm.',
      'Đánh giá xu hướng 7–14 ngày thay vì phản ứng với một đêm đơn lẻ.',
      'Chất lượng ngủ còn thể hiện qua khả năng tỉnh táo và hoạt động ban ngày.',
    ],
    sections: [
      {
        heading: 'Chất lượng giấc ngủ không chỉ là số giờ',
        paragraphs: [
          'Thời lượng là điểm khởi đầu dễ đo, nhưng không phải toàn bộ câu chuyện. Một đêm ngủ đủ giờ vẫn có thể kém phục hồi nếu bạn mất nhiều thời gian để vào giấc, thức giấc nhiều lần hoặc thức dậy trong trạng thái mệt mỏi.',
          'Khi tự theo dõi, hãy ghi bốn tín hiệu: tổng thời gian ngủ ước tính, thời gian cần để vào giấc, số lần thức giấc đáng kể và mức tỉnh táo vào buổi sáng. Thiết bị đeo có thể hỗ trợ nhận biết xu hướng nhưng không phải công cụ chẩn đoán.',
        ],
      },
      {
        heading: '1. Bảo vệ một cửa sổ ngủ đủ dài',
        paragraphs: [
          'Tuyên bố đồng thuận của American Academy of Sleep Medicine và Sleep Research Society khuyến nghị người trưởng thành ngủ từ 7 giờ mỗi đêm một cách đều đặn. Nhu cầu cá nhân vẫn khác nhau; người trẻ, người đang bù thiếu ngủ hoặc đang có bệnh có thể cần nhiều hơn.',
          'Thay vì ép bản thân phải ngủ ngay, hãy bắt đầu từ lịch thức dậy. Chọn một giờ thức phù hợp với phần lớn ngày trong tuần rồi lùi lại một cửa sổ đủ dài cho việc thư giãn và ngủ.',
        ],
      },
      {
        heading: '2. Giảm tín hiệu gây tỉnh táo',
        paragraphs: [
          'Ánh sáng mạnh, công việc kích thích, nicotine và caffeine đều có thể làm cơ thể khó chuyển sang trạng thái nghỉ. NHLBI lưu ý tác động của caffeine có thể kéo dài nhiều giờ; một cốc cà phê cuối buổi chiều vẫn có thể ảnh hưởng giờ ngủ ở một số người.',
          'Không cần biến buổi tối thành một nghi thức phức tạp. Hãy thử 30–60 phút hạ nhịp với ánh sáng dịu, hoạt động lặp lại và ít quyết định.',
        ],
      },
      {
        heading: '3. Thiết kế môi trường ngủ',
        paragraphs: [
          'Một phòng ngủ tối, yên và mát thường hỗ trợ giấc ngủ tốt hơn. Ưu tiên thay đổi có tác động lớn nhất với hoàn cảnh của bạn: rèm cản sáng, giảm thông báo, nút tai hoặc sắp xếp chăn gối thoải mái.',
        ],
      },
      {
        heading: '4. Đọc dữ liệu theo tuần',
        paragraphs: [
          'Trong 7 ngày, mỗi sáng hãy ghi giờ ngủ, giờ thức, số lần tỉnh giấc và mức năng lượng từ 1 đến 5. Chỉ thử một thay đổi, chẳng hạn đưa caffeine về đầu ngày hoặc giữ giờ thức dậy chênh không quá khoảng một giờ.',
          'Sau một tuần, giữ điều có ích, bỏ điều gây quá tải và tiếp tục quan sát. Cách làm này biến lời khuyên chung thành dữ liệu phù hợp với nhịp sống của chính bạn.',
        ],
      },
      {
        heading: 'Khi nào nên tìm hỗ trợ chuyên môn?',
        paragraphs: [
          'Hãy trao đổi với bác sĩ hoặc cơ sở y tế nếu khó ngủ kéo dài, buồn ngủ ban ngày ảnh hưởng an toàn, ngáy to kèm ngưng thở hoặc tình trạng giấc ngủ thay đổi đột ngột. PrymaLab cung cấp giáo dục và cấu trúc thói quen, không chẩn đoán hay điều trị rối loạn giấc ngủ.',
        ],
      },
    ],
    sources: [
      { label: 'Khuyến nghị thời lượng ngủ cho người trưởng thành', publisher: 'AASM & Sleep Research Society', url: 'https://aasm.org/resources/pdf/pressroom/adult-sleep-duration-consensus.pdf' },
      { label: 'Healthy Sleep Habits', publisher: 'NHLBI, National Institutes of Health', url: 'https://www.nhlbi.nih.gov/health/sleep-deprivation/healthy-sleep-habits' },
    ],
  },
  {
    slug: 'dinh-duong-va-giac-ngu',
    title: 'Dinh dưỡng và giấc ngủ: xây nhịp ăn để buổi tối nhẹ hơn',
    metaTitle: 'Dinh dưỡng và giấc ngủ: nhịp ăn tối ưu',
    description: 'Mối liên hệ thực hành giữa giờ ăn, caffeine, bữa tối và giấc ngủ; cách thử nghiệm thay đổi an toàn trong đời sống hằng ngày.',
    directAnswer: 'Dinh dưỡng hỗ trợ giấc ngủ tốt nhất khi tạo được nhịp ổn định: ăn đủ trong ngày, tránh bữa quá nặng sát giờ ngủ, quan sát thời điểm dùng caffeine và không dùng rượu như một “thuốc ngủ”. Không có một thực phẩm đơn lẻ nào bảo đảm ngủ ngon cho mọi người.',
    category: 'Dinh dưỡng',
    publishedAt: '2026-08-19',
    updatedAt: '2026-08-19',
    displayDate: '19/08/2026',
    readTime: '8 phút đọc',
    accent: 'from-[#17483f] via-[#4f8a6c] to-[#d3bb73]',
    image: '/images/nutrition_premium.jpg',
    imageAlt: 'Bữa ăn cân bằng với rau xanh và thực phẩm nguyên bản',
    highlights: [
      'Nhịp ăn ổn định thường hữu ích hơn việc săn tìm một “siêu thực phẩm” gây ngủ.',
      'Bữa quá lớn, caffeine muộn và rượu gần giờ ngủ có thể làm giấc ngủ khó ổn định.',
      'Thử một thay đổi trong 7 ngày để biết điều gì thực sự phù hợp với bạn.',
    ],
    sections: [
      {
        heading: 'Vì sao ăn và ngủ cần được nhìn cùng nhau?',
        paragraphs: [
          'Giờ ăn là một phần của nhịp sinh hoạt. Một ngày bỏ bữa rồi ăn bù rất muộn có thể khiến buổi tối nặng nề; ngược lại, một đêm ngủ kém thường làm việc lựa chọn và chuẩn bị bữa ăn ngày hôm sau khó hơn.',
          'PrymaLab không coi dinh dưỡng là danh sách thực phẩm tốt và xấu. Mục tiêu là tạo cấu trúc đủ linh hoạt để có năng lượng ban ngày và không phải giải quyết cơn đói lớn ngay trước giờ ngủ.',
        ],
      },
      {
        heading: 'Ưu tiên nhịp ăn trước thành phần hoàn hảo',
        paragraphs: [
          'Hãy bắt đầu bằng ba câu hỏi: bạn có thường xuyên bỏ bữa không, bữa lớn nhất nằm quá sát giờ ngủ không, và khoảng cách giữa bữa cuối với giờ lên giường có khiến bạn quá no hoặc quá đói không.',
          'Nếu thường ăn rất muộn, đừng dịch chuyển toàn bộ ngay trong một ngày. Có thể tăng chất lượng bữa sớm hơn, chuẩn bị một lựa chọn nhẹ cho cuối ngày và đưa bữa tối tiến lên từng bước nhỏ.',
        ],
      },
      {
        heading: 'Caffeine: thời điểm cũng quan trọng',
        paragraphs: [
          'Caffeine chặn tín hiệu adenosine liên quan đến áp lực ngủ. NHLBI cho biết tác động có thể kéo dài tới khoảng 8 giờ ở một số người. Khả năng chuyển hóa khác nhau nên không có một mốc giờ duy nhất đúng cho tất cả.',
          'Một thử nghiệm đơn giản là giữ lượng dùng tương đối ổn định nhưng đưa lần dùng cuối sớm hơn trong 7 ngày. Theo dõi thời gian vào giấc và mức tỉnh táo sáng hôm sau trước khi quyết định có cần giảm thêm.',
        ],
      },
      {
        heading: 'Bữa tối và rượu',
        paragraphs: [
          'NHLBI khuyến nghị tránh bữa nặng hoặc quá lớn trong vài giờ trước khi ngủ. Nếu đói, một bữa nhẹ có thể phù hợp hơn việc cố nhịn. Người có bệnh nền hoặc chế độ điều trị riêng cần làm theo hướng dẫn của nhân viên y tế.',
          'Rượu có thể tạo cảm giác buồn ngủ lúc đầu nhưng làm giấc ngủ nhẹ và dễ gián đoạn hơn về sau. Vì vậy không nên dùng rượu như cách tự điều trị mất ngủ.',
        ],
      },
      {
        heading: 'Một thử nghiệm 7 ngày',
        paragraphs: ['Chọn duy nhất một biến: giờ caffeine cuối, thời điểm bữa tối hoặc mức độ no trước khi ngủ. Ghi biến đó cùng thời gian vào giấc, số lần thức giấc và mức năng lượng sáng hôm sau.'],
        bullets: [
          'Ngày 1–2: chỉ quan sát, chưa cần sửa.',
          'Ngày 3–7: áp dụng một thay đổi nhỏ và giữ các yếu tố khác tương đối ổn định.',
          'Cuối tuần: giữ thay đổi nếu có lợi và thực tế; nếu không, thử biến khác.',
        ],
      },
      {
        heading: 'Giới hạn cần nhớ',
        paragraphs: ['Nội dung này không phải đơn ăn hay điều trị. Nếu có sụt cân không chủ ý, rối loạn ăn uống, triệu chứng tiêu hóa kéo dài, đang mang thai, có bệnh nền hoặc dùng thuốc ảnh hưởng giấc ngủ, hãy trao đổi với chuyên gia y tế phù hợp.'],
      },
    ],
    sources: [
      { label: 'Healthy Sleep Habits', publisher: 'NHLBI, National Institutes of Health', url: 'https://www.nhlbi.nih.gov/health/sleep-deprivation/healthy-sleep-habits' },
      { label: 'Sleep/Wake Cycle', publisher: 'NHLBI, National Institutes of Health', url: 'https://www.nhlbi.nih.gov/health/sleep/sleep-wake-cycle' },
    ],
  },
  {
    slug: 'tdee-la-gi-cach-uoc-tinh',
    title: 'TDEE là gì? Cách ước tính mà không thần thánh hóa con số',
    metaTitle: 'TDEE là gì? Cách ước tính nhu cầu năng lượng',
    description: 'Giải thích BMR, TDEE, phương trình Mifflin–St Jeor, hệ số vận động và cách dùng khoảng ước tính an toàn hơn một con số tuyệt đối.',
    directAnswer: 'TDEE là ước tính tổng năng lượng cơ thể sử dụng trong một ngày. Con số thường được tính từ năng lượng nghỉ ước tính rồi nhân với hệ số vận động; đây là điểm khởi đầu để quan sát, không phải phép đo chính xác hay đơn ăn cá nhân.',
    category: 'Dinh dưỡng',
    publishedAt: '2026-08-19',
    updatedAt: '2026-08-19',
    displayDate: '19/08/2026',
    readTime: '9 phút đọc',
    accent: 'from-[#172f44] via-[#315f78] to-[#7fbab1]',
    image: '/images/hero_wellness.jpg',
    imageAlt: 'Bữa ăn cân bằng trong một không gian sống thư thái',
    highlights: [
      'TDEE là ước tính, không phải lượng calo bắt buộc phải ăn.',
      'PrymaLab dùng Mifflin–St Jeor cho BMR và hiển thị một khoảng quanh TDEE.',
      'Phản hồi thực tế trong 2–4 tuần quan trọng hơn độ chính xác giả tạo.',
    ],
    sections: [
      {
        heading: 'BMR và TDEE khác nhau thế nào?',
        paragraphs: [
          'BMR là mức năng lượng ước tính cơ thể cần để duy trì các chức năng cơ bản khi nghỉ. TDEE mở rộng con số đó bằng cách tính thêm hoạt động hằng ngày và vận động có chủ đích.',
          'Trong công cụ PrymaLab, BMR được ước tính bằng phương trình Mifflin–St Jeor dựa trên cân nặng, chiều cao, tuổi và giới tính dùng trong phương trình. TDEE sau đó được tính bằng hệ số hoạt động do người dùng tự chọn.',
        ],
      },
      {
        heading: 'Phương trình đến từ đâu?',
        paragraphs: [
          'Nghiên cứu gốc công bố năm 1990 xây dựng phương trình dự đoán năng lượng nghỉ từ dữ liệu 498 người trưởng thành khỏe mạnh. Năng lượng nghỉ được đo bằng nhiệt lượng gián tiếp.',
          'Một phương trình quần thể luôn có sai số khi áp dụng cho cá nhân. Thành phần cơ thể, bệnh lý, thuốc, giai đoạn sống và mức vận động thực tế có thể khiến nhu cầu khác đáng kể.',
        ],
      },
      {
        heading: 'Vì sao PrymaLab hiển thị một khoảng?',
        paragraphs: [
          'Hệ số hoạt động là phần dễ sai vì “vận động vừa” có thể mang ý nghĩa rất khác giữa hai người. Hiển thị một khoảng quanh TDEE nhắc rằng đây là vùng khởi đầu, không phải mục tiêu cứng.',
          'Nếu muốn hiểu nhu cầu thực tế, hãy giữ cách ghi nhận tương đối nhất quán trong 2–4 tuần rồi quan sát cân nặng, vòng eo, hiệu suất, cảm giác đói, năng lượng và giấc ngủ.',
        ],
      },
      {
        heading: 'BMI có vai trò gì?',
        paragraphs: [
          'BMI được tính bằng cân nặng chia cho bình phương chiều cao. WHO sử dụng BMI như chỉ số sàng lọc ở người trưởng thành nhưng cũng nêu rõ đây là chỉ dấu thay thế và cần được đọc cùng các đánh giá khác.',
          'BMI không đo trực tiếp thành phần cơ thể và không mô tả đầy đủ sức khỏe một cá nhân. Người có nhiều khối cơ, người cao tuổi, phụ nữ mang thai và một số nhóm dân số cần cách diễn giải phù hợp hơn.',
        ],
      },
      {
        heading: 'Dùng TDEE một cách thực tế',
        paragraphs: ['Hãy xem TDEE như giả thuyết ban đầu. Bắt đầu gần mức duy trì, theo dõi phản hồi và điều chỉnh nhỏ thay vì cắt giảm cực đoan. Nếu mục tiêu liên quan điều trị bệnh hoặc thay đổi cân nặng đáng kể, hãy làm việc với chuyên gia y tế phù hợp.'],
      },
    ],
    sources: [
      { label: 'A new predictive equation for resting energy expenditure', publisher: 'The American Journal of Clinical Nutrition / PubMed', url: 'https://pubmed.ncbi.nlm.nih.gov/2305711/' },
      { label: 'Obesity and overweight: BMI definition and limitations', publisher: 'World Health Organization', url: 'https://www.who.int/news-room/fact-sheets/detail/obesity-and-overweight' },
    ],
  },
  {
    slug: 'sleep-hygiene-la-gi',
    title: 'Sleep hygiene là gì? Checklist vệ sinh giấc ngủ có thể bắt đầu tối nay',
    metaTitle: 'Sleep hygiene là gì? 7 nguyên tắc dễ áp dụng',
    description: 'Giải thích sleep hygiene, những thói quen cốt lõi và checklist 7 ngày giúp bạn tạo điều kiện ngủ ổn định hơn mà không biến buổi tối thành một nghi thức nặng nề.',
    directAnswer: 'Sleep hygiene, hay vệ sinh giấc ngủ, là tập hợp thói quen ban ngày, routine buổi tối và điều kiện phòng ngủ giúp tạo cơ hội cho giấc ngủ đều và phục hồi hơn. Đây là nền tảng hỗ trợ giấc ngủ, không phải phương pháp chẩn đoán hoặc điều trị mọi nguyên nhân gây mất ngủ.',
    category: 'Giấc ngủ',
    publishedAt: '2026-08-19',
    updatedAt: '2026-08-19',
    displayDate: '19/08/2026',
    readTime: '8 phút đọc',
    accent: 'from-[#102b3a] via-[#31536a] to-[#9bb9c8]',
    image: '/images/sleep_serene.jpg',
    imageAlt: 'Phòng ngủ gọn gàng, tối và yên tĩnh hỗ trợ vệ sinh giấc ngủ',
    highlights: [
      'Sleep hygiene gồm cả lịch ngủ, ánh sáng, caffeine, vận động và môi trường phòng ngủ.',
      'Giờ thức dậy tương đối ổn định là một điểm neo dễ bắt đầu hơn việc ép bản thân ngủ ngay.',
      'Hãy thử từng thay đổi trong 7 ngày thay vì áp dụng một checklist hoàn hảo cùng lúc.',
    ],
    sections: [
      {
        heading: 'Vệ sinh giấc ngủ không có nghĩa là phòng ngủ phải hoàn hảo',
        paragraphs: [
          'Khái niệm này mô tả những điều bạn làm và môi trường bạn tạo ra để hỗ trợ nhịp ngủ–thức. Một phòng tối và mát có ích, nhưng lịch thức dậy, thời điểm dùng caffeine, vận động và cách hạ nhịp trước ngủ cũng quan trọng.',
          'Mục tiêu thực tế là giảm các tín hiệu khiến cơ thể phải tỉnh táo sai thời điểm. Không cần mua nhiều thiết bị hoặc sao chép nguyên routine của người khác.',
        ],
      },
      {
        heading: 'Checklist 6 điểm cốt lõi',
        paragraphs: ['Hướng dẫn của NHLBI và CDC cùng nhấn mạnh một số nền tảng có thể áp dụng cho phần lớn người trưởng thành khỏe mạnh.'],
        bullets: [
          'Dành đủ cửa sổ thời gian cho giấc ngủ và giữ giờ thức dậy tương đối ổn định.',
          'Dùng khoảng thời gian trước ngủ cho hoạt động yên tĩnh, ít ánh sáng mạnh và ít quyết định.',
          'Tránh bữa quá lớn, rượu, nicotine và caffeine gần giờ ngủ.',
          'Duy trì vận động ban ngày và tiếp xúc ánh sáng tự nhiên khi có thể.',
          'Giữ phòng ngủ yên, tối, mát và hạn chế thông báo làm gián đoạn.',
          'Nếu ngủ trưa làm khó ngủ buổi tối, thử rút ngắn hoặc đưa giấc ngủ trưa về sớm hơn.',
        ],
      },
      {
        heading: 'Cách chọn một thay đổi đúng',
        paragraphs: [
          'Đừng bắt đầu bằng cả sáu điểm. Hãy xác định nút thắt dễ thấy nhất: giờ thức thay đổi quá nhiều, caffeine muộn, bữa tối quá sát giờ ngủ hay phòng quá sáng. Chọn một biến và giữ trong một tuần.',
          'Mỗi sáng ghi ba điều: thời gian ước tính để vào giấc, số lần thức giấc đáng kể và mức tỉnh táo từ 1 đến 5. Xu hướng của chính bạn có giá trị hơn một “routine chuẩn” trên mạng.',
        ],
      },
      {
        heading: 'Sleep hygiene có chữa mất ngủ không?',
        paragraphs: [
          'Không nên xem vệ sinh giấc ngủ như một phương pháp chữa tất cả trường hợp mất ngủ. Khó ngủ có thể liên quan đến nhiều yếu tố tâm lý, y khoa, thuốc, lịch làm việc hoặc rối loạn giấc ngủ. Thói quen tốt tạo nền tảng nhưng đôi khi không đủ.',
          'Nếu khó ngủ kéo dài, buồn ngủ ban ngày ảnh hưởng công việc hoặc an toàn, ngáy to kèm dấu hiệu ngưng thở, hãy trao đổi với bác sĩ hoặc cơ sở chuyên môn.',
        ],
      },
      {
        heading: 'Một kế hoạch 7 ngày vừa sức',
        paragraphs: [
          'Ngày đầu tiên chỉ ghi nhận. Từ ngày 2 đến ngày 7, giữ một giờ thức mục tiêu trong biên độ khoảng một giờ và chọn thêm đúng một thay đổi hỗ trợ. Cuối tuần, đánh giá hiệu quả lẫn mức độ dễ duy trì trước khi thêm bước tiếp theo.',
        ],
      },
    ],
    sources: [
      { label: 'Healthy Sleep Habits', publisher: 'NHLBI, National Institutes of Health', url: 'https://www.nhlbi.nih.gov/health/sleep-deprivation/healthy-sleep-habits' },
      { label: 'About Sleep: Better Sleep Habits', publisher: 'Centers for Disease Control and Prevention', url: 'https://www.cdc.gov/sleep/about/index.html' },
    ],
  },
  {
    slug: 'caffeine-anh-huong-giac-ngu-bao-lau',
    title: 'Caffeine ảnh hưởng giấc ngủ bao lâu? Cách tìm giờ cắt caffeine phù hợp',
    metaTitle: 'Caffeine ảnh hưởng giấc ngủ bao lâu?',
    description: 'Caffeine có thể tác động nhiều giờ sau khi uống. Tìm hiểu bằng chứng về mốc 6–8 giờ và cách thử nghiệm giờ cắt caffeine theo phản hồi thực tế.',
    directAnswer: 'Caffeine có thể tiếp tục ảnh hưởng giấc ngủ nhiều giờ sau khi dùng; NHLBI lưu ý tác động có thể kéo dài tới khoảng 8 giờ ở một số người. Một nghiên cứu với liều 400 mg ghi nhận giấc ngủ bị ảnh hưởng ngay cả khi caffeine được dùng trước giờ ngủ 6 giờ, nhưng mức tác động thực tế còn phụ thuộc liều, cơ địa và thói quen sử dụng.',
    category: 'Dinh dưỡng',
    publishedAt: '2026-08-19',
    updatedAt: '2026-08-19',
    displayDate: '19/08/2026',
    readTime: '8 phút đọc',
    accent: 'from-[#2f3027] via-[#6f6142] to-[#c9aa71]',
    image: '/images/nutrition_premium.jpg',
    imageAlt: 'Bữa ăn và đồ uống trong ngày cần được sắp xếp để không ảnh hưởng giờ ngủ',
    highlights: [
      'Không có một giờ cắt caffeine đúng cho tất cả mọi người.',
      'Mốc 6–8 giờ trước khi ngủ là điểm bắt đầu thận trọng, không phải quy tắc cứng.',
      'Cần đọc cả liều lượng, nguồn caffeine và phản hồi trong ít nhất một tuần.',
    ],
    sections: [
      {
        heading: 'Vì sao uống buổi chiều vẫn có thể ảnh hưởng buổi tối?',
        paragraphs: [
          'Caffeine làm giảm cảm nhận áp lực ngủ bằng cách cản trở tín hiệu adenosine. Cảm giác tỉnh có thể giảm trước khi toàn bộ tác động lên giấc ngủ biến mất, vì vậy “tôi vẫn ngủ được” không luôn đồng nghĩa cấu trúc giấc ngủ không bị ảnh hưởng.',
          'Khả năng chuyển hóa caffeine khác nhau giữa từng người và có thể chịu ảnh hưởng bởi liều dùng, tần suất, thuốc, thai kỳ và nhiều yếu tố sinh học khác.',
        ],
      },
      {
        heading: 'Bằng chứng về mốc 6 giờ nói điều gì?',
        paragraphs: [
          'Một thử nghiệm ngẫu nhiên chéo công bố trên Journal of Clinical Sleep Medicine so sánh 400 mg caffeine ở thời điểm 0, 3 và 6 giờ trước giờ ngủ với giả dược. Cả ba thời điểm đều tạo khác biệt đáng kể về rối loạn giấc ngủ trong mẫu nghiên cứu.',
          'Điều quan trọng là nghiên cứu dùng liều 400 mg, cao hơn nhiều khẩu phần cà phê thông thường. Không nên suy diễn rằng một lượng nhỏ sẽ tạo tác động giống hệt ở mọi người.',
        ],
      },
      {
        heading: 'Cách đặt giờ cắt caffeine cá nhân',
        paragraphs: [
          'Lấy giờ lên giường thường lệ và lùi lại 6–8 giờ để tạo một mốc thử nghiệm. Trong 7 ngày, giữ tổng lượng tương đối ổn định nhưng không dùng sau mốc đó. Theo dõi thời gian vào giấc, số lần thức và mức tỉnh táo buổi sáng.',
          'Nếu vẫn khó ngủ, đưa mốc sớm hơn hoặc giảm tổng lượng. Nếu không thấy khác biệt và việc giữ mốc gây bất tiện, điều chỉnh từng bước thay vì áp dụng cứng nhắc.',
        ],
      },
      {
        heading: 'Đừng quên những nguồn caffeine ít được chú ý',
        paragraphs: ['Caffeine có thể có trong trà, nước tăng lực, cola, chocolate, pre-workout và một số thuốc không kê đơn. Nhãn sản phẩm và khẩu phần thực tế giúp bạn ước tính tốt hơn việc chỉ đếm số cốc.'],
      },
      {
        heading: 'Khi nào nên tìm hỗ trợ?',
        paragraphs: ['Nếu tim đập nhanh, lo âu rõ, khó ngủ kéo dài hoặc bạn đang mang thai, có bệnh nền hay dùng thuốc, hãy hỏi nhân viên y tế về lượng caffeine phù hợp. Không dùng bài viết này để tự thay đổi thuốc hoặc xử lý triệu chứng cấp tính.'],
      },
    ],
    sources: [
      { label: 'Healthy Sleep Habits: caffeine can interfere with sleep', publisher: 'NHLBI, National Institutes of Health', url: 'https://www.nhlbi.nih.gov/health/sleep-deprivation/healthy-sleep-habits' },
      { label: 'Caffeine effects on sleep taken 0, 3, or 6 hours before going to bed', publisher: 'Journal of Clinical Sleep Medicine / PubMed', url: 'https://pubmed.ncbi.nlm.nih.gov/24235903/' },
    ],
  },
  {
    slug: 'nhip-sinh-hoc-la-gi',
    title: 'Nhịp sinh học là gì? Cách ánh sáng, giờ ngủ và bữa ăn tạo nhịp 24 giờ',
    metaTitle: 'Nhịp sinh học là gì? 3 điểm neo mỗi ngày',
    description: 'Giải thích nhịp sinh học, đồng hồ sinh học trung tâm và vai trò của ánh sáng, giờ thức dậy, vận động cùng bữa ăn trong nhịp sống hằng ngày.',
    directAnswer: 'Nhịp sinh học là những thay đổi thể chất, tinh thần và hành vi lặp lại theo chu kỳ khoảng 24 giờ. Ánh sáng và bóng tối là tín hiệu mạnh nhất, trong khi giờ ăn, vận động, căng thẳng và môi trường xã hội cũng góp phần điều chỉnh nhịp của cơ thể.',
    category: 'Nhịp sống',
    publishedAt: '2026-08-19',
    updatedAt: '2026-08-19',
    displayDate: '19/08/2026',
    readTime: '9 phút đọc',
    accent: 'from-[#172f44] via-[#315f78] to-[#a7cbbb]',
    image: '/images/hero_wellness.jpg',
    imageAlt: 'Ánh sáng ban ngày, bữa ăn và nghỉ ngơi cùng tạo nên nhịp sống 24 giờ',
    highlights: [
      'Nhịp sinh học không chỉ điều khiển ngủ; nó còn liên quan hormone, nhiệt độ, cảm giác đói và tiêu hóa.',
      'Ánh sáng là tín hiệu môi trường mạnh nhất để đồng bộ đồng hồ trung tâm.',
      'Giờ thức dậy và ánh sáng đầu ngày là hai điểm neo thực tế cho một lịch sống ổn định hơn.',
    ],
    sections: [
      {
        heading: 'Đồng hồ sinh học và nhịp sinh học khác nhau thế nào?',
        paragraphs: [
          'Đồng hồ sinh học là hệ thống điều phối thời gian bên trong cơ thể; nhịp sinh học là những biến đổi được hệ thống đó tạo ra. Ở người, một vùng não gọi là nhân trên giao thoa thị giác đóng vai trò đồng hồ trung tâm và nhận tín hiệu ánh sáng qua mắt.',
          'NIGMS cho biết gần như mọi mô và cơ quan đều có nhịp riêng. Đồng hồ trung tâm giúp các nhịp này đi cùng chu kỳ ngày–đêm bên ngoài.',
        ],
      },
      {
        heading: 'Ánh sáng tác động tới giấc ngủ ra sao?',
        paragraphs: [
          'Ánh sáng ban ngày báo cho hệ thống thời gian rằng cơ thể cần tỉnh táo. Khi trời tối, đồng hồ trung tâm hỗ trợ tăng tín hiệu melatonin và chuẩn bị cho trạng thái buồn ngủ. Ánh sáng nhân tạo mạnh vào buổi tối có thể gửi tín hiệu tỉnh táo không đúng lúc.',
          'Điều này không có nghĩa mọi màn hình đều gây mất ngủ như nhau. Thời điểm, độ sáng, khoảng cách và nội dung kích thích đều góp phần vào phản hồi thực tế.',
        ],
      },
      {
        heading: 'Ba điểm neo dễ thực hành',
        paragraphs: ['Một nhịp ổn định không bắt đầu từ việc ép giờ ngủ. Hãy thử neo lịch bằng những tín hiệu dễ kiểm soát hơn.'],
        bullets: [
          'Giữ giờ thức dậy trong một biên độ tương đối ổn định giữa các ngày.',
          'Tiếp xúc ánh sáng ban ngày, đặc biệt vào phần đầu ngày khi điều kiện cho phép.',
          'Giữ bữa ăn và vận động trong những khung giờ có thể dự đoán thay vì thay đổi cực đoan mỗi ngày.',
        ],
      },
      {
        heading: 'Làm ca và lệch múi giờ cần cách tiếp cận khác',
        paragraphs: [
          'Người làm ca đêm, thường xuyên đi công tác hoặc phải thay lịch liên tục có thể không áp dụng được lời khuyên dành cho lịch ngày thông thường. Khi đó mục tiêu là bảo vệ đủ thời gian ngủ, quản lý ánh sáng và giảm số lần đổi ca khi có thể.',
          'Nếu lịch làm việc gây buồn ngủ nguy hiểm, khó thích nghi kéo dài hoặc ảnh hưởng sức khỏe, hãy trao đổi với bác sĩ hoặc đơn vị y học giấc ngủ.',
        ],
      },
      {
        heading: 'Theo dõi nhịp trong 7 ngày',
        paragraphs: ['Ghi giờ thức dậy, lần tiếp xúc ánh sáng ngoài trời đầu tiên, giờ caffeine cuối, bữa tối và giờ lên giường. Đừng tìm một ngày hoàn hảo; hãy tìm tín hiệu nào thay đổi nhiều nhất và chọn một điểm neo cho tuần kế tiếp.'],
      },
    ],
    sources: [
      { label: 'Circadian Rhythms', publisher: 'National Institute of General Medical Sciences, NIH', url: 'https://www.nigms.nih.gov/education/fact-sheets/Pages/circadian-rhythms' },
      { label: 'Your Sleep/Wake Cycle', publisher: 'NHLBI, National Institutes of Health', url: 'https://www.nhlbi.nih.gov/health/sleep/sleep-wake-cycle' },
    ],
  },
];

export function getKnowledgeArticle(slug: string) {
  return knowledgeArticles.find((article) => article.slug === slug);
}
