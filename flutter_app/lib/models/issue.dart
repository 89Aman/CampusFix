class Issue {
  final int id;
  final String description;
  final String location;
  final String? imageUrl;
  final String status;
  final int upvotes;
  final DateTime createdAt;
  final String? reporterName;
  final String? reporterEmail;

  Issue({
    required this.id,
    required this.description,
    required this.location,
    this.imageUrl,
    required this.status,
    required this.upvotes,
    required this.createdAt,
    this.reporterName,
    this.reporterEmail,
  });

  factory Issue.fromJson(Map<String, dynamic> json) {
    return Issue(
      id: json['id'],
      description: json['description'],
      location: json['location'],
      imageUrl: json['image_url'],
      status: json['status'],
      upvotes: json['upvotes'],
      createdAt: DateTime.parse(json['created_at']),
      reporterName: json['reporter_name'],
      reporterEmail: json['reporter_email'],
    );
  }
}
